// /api/audit?url=example.com  Runs fast on-page and technical checks on one page.
import { parse } from 'node-html-parser';
import { normalizeUrl, fetchPage, rateLimited, send } from './_lib/safe.js';

const wordCount = (s) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return send(res, 405, { error: 'Use GET.' });
    if (rateLimited(req)) return send(res, 429, { error: 'Too many checks from your connection. Please try again later.' });
    const input = new URL(req.url, 'http://local').searchParams.get('url');
    const page = await fetchPage(normalizeUrl(input));
    const type = (page.headers.get('content-type') || '').toLowerCase();
    if (page.status >= 400) return send(res, 200, { error: `The website answered with an error (status ${page.status}).` });
    if (type && !type.includes('html')) return send(res, 200, { error: 'That address does not return a web page.' });

    const checks = [];
    const ck = (group, label, status, detail, fix = '') => checks.push({ group, label, status, detail, fix });
    const final = page.finalUrl;
    const origin = final.origin;
    const root = parse(page.body);
    const all = (s) => root.querySelectorAll(s);
    const metas = all('meta');
    const meta = (n) => metas.find((m) => (m.getAttribute('name') || '').toLowerCase() === n);
    const prop = (n) => metas.find((m) => (m.getAttribute('property') || '').toLowerCase() === n);
    const links = all('link');
    const rel = (r) => links.filter((l) => (l.getAttribute('rel') || '').toLowerCase().split(/\s+/).includes(r));

    const ld = [];
    all('script').forEach((s) => {
      if ((s.getAttribute('type') || '').toLowerCase() === 'application/ld+json') { try { ld.push(JSON.parse(s.rawText)); } catch { ld.push(null); } }
    });
    const scriptCount = all('script').length;
    const types = new Set();
    const walk = (o) => {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) return o.forEach(walk);
      const t = o['@type'];
      (Array.isArray(t) ? t : t ? [t] : []).forEach((x) => types.add(String(x)));
      if (o['@graph']) walk(o['@graph']);
    };
    ld.forEach(walk);

    // ---- Page basics
    const G1 = 'Page basics';
    if (final.protocol === 'https:') ck(G1, 'Secure connection (HTTPS)', 'pass', 'The page loads over HTTPS.');
    else ck(G1, 'Secure connection (HTTPS)', 'fail', 'The page loads over plain HTTP.', 'Install an SSL certificate and redirect all pages to https.');
    if (page.chain.length === 0) ck(G1, 'Redirects', 'pass', 'The address loads directly with no redirects.');
    else if (page.chain.length <= 2) ck(G1, 'Redirects', 'info', `${page.chain.length} redirect(s) before the final page: ${final.href}`);
    else ck(G1, 'Redirects', 'warn', `${page.chain.length} redirects before the final page.`, 'Reduce redirect chains to a single step.');
    const ms = page.ms;
    ck(G1, 'Page response time', ms < 1000 ? 'pass' : ms < 2500 ? 'warn' : 'fail', `The page took about ${(ms / 1000).toFixed(1)} seconds to download, including any redirects.`, ms < 1000 ? '' : 'Improve hosting, add caching and reduce server work so the page responds faster.');

    const title = (root.querySelector('title')?.text || '').trim().replace(/\s+/g, ' ');
    if (!title) ck(G1, 'Title tag', 'fail', 'No title tag found.', 'Add a unique title of about 30 to 60 characters that includes your main keyword.');
    else if (title.length < 25 || title.length > 65) ck(G1, 'Title tag', 'warn', `"${title}" is ${title.length} characters.`, 'Aim for about 30 to 60 characters so it is not cut off in results.');
    else ck(G1, 'Title tag', 'pass', `"${title}" (${title.length} characters).`);

    const desc = (meta('description')?.getAttribute('content') || '').trim();
    if (!desc) ck(G1, 'Meta description', 'fail', 'No meta description found.', 'Write a description of about 70 to 160 characters with a clear benefit and next step.');
    else if (desc.length < 70 || desc.length > 170) ck(G1, 'Meta description', 'warn', `${desc.length} characters.`, 'Aim for about 70 to 160 characters.');
    else ck(G1, 'Meta description', 'pass', `${desc.length} characters.`);

    const h1s = all('h1');
    if (h1s.length === 1) ck(G1, 'Main heading (H1)', 'pass', `One H1: "${h1s[0].text.trim().replace(/\s+/g, ' ').slice(0, 90)}"`);
    else if (h1s.length === 0) ck(G1, 'Main heading (H1)', 'fail', 'No H1 heading found.', 'Add one H1 that states the main topic of the page.');
    else ck(G1, 'Main heading (H1)', 'warn', `${h1s.length} H1 headings found.`, 'Use a single H1 and organise the rest with H2 and H3 headings.');

    const canon = rel('canonical')[0]?.getAttribute('href');
    if (!canon) ck(G1, 'Canonical tag', 'warn', 'No canonical tag found.', 'Add a canonical link pointing to the preferred address of this page.');
    else { let ok = true; try { ok = new URL(canon, final).host === final.host; } catch {} ck(G1, 'Canonical tag', ok ? 'pass' : 'warn', ok ? `Points to ${canon}` : `Points to a different site: ${canon}`, ok ? '' : 'Check the canonical points to your own preferred address.'); }

    const robotsMeta = (meta('robots')?.getAttribute('content') || '').toLowerCase();
    const xrobots = (page.headers.get('x-robots-tag') || '').toLowerCase();
    if (robotsMeta.includes('noindex') || xrobots.includes('noindex')) ck(G1, 'Indexing allowed', 'fail', 'The page tells search engines not to index it (noindex).', 'Remove the noindex tag if you want this page to appear in search.');
    else ck(G1, 'Indexing allowed', 'pass', 'No noindex instruction found.');

    if (meta('viewport')) ck(G1, 'Mobile viewport', 'pass', 'A viewport tag is present.');
    else ck(G1, 'Mobile viewport', 'fail', 'No viewport tag found.', 'Add a viewport meta tag so the page displays properly on phones.');

    const lang = root.querySelector('html')?.getAttribute('lang');
    if (lang) ck(G1, 'Page language', 'pass', `Language set to "${lang}".`);
    else ck(G1, 'Page language', 'warn', 'No language attribute on the html tag.', 'Add a lang attribute, for example lang="en".');

    // ---- Content
    const G2 = 'Content';
    const heads = { h2: all('h2').length, h3: all('h3').length };
    const imgs = all('img');
    const missingAlt = imgs.filter((i) => i.getAttribute('alt') === undefined).length;
    const anchors = all('a').filter((a) => a.getAttribute('href'));
    let internal = 0, external = 0;
    anchors.forEach((a) => { try { const u = new URL(a.getAttribute('href'), final); if (!/^https?:$/.test(u.protocol)) return; u.host === final.host ? internal++ : external++; } catch {} });
    all('script,style,noscript').forEach((n) => n.remove());
    const wc = wordCount((root.querySelector('body') || root).text || '');
    ck(G2, 'Amount of text', wc >= 300 ? 'pass' : wc >= 120 ? 'warn' : 'fail', `About ${wc} words of text on the page.`, wc >= 300 ? '' : 'Add helpful, specific content. Pages that answer a search well usually need more than a few lines.');
    ck(G2, 'Subheadings', heads.h2 > 0 ? 'pass' : 'warn', heads.h2 > 0 ? `${heads.h2} H2 and ${heads.h3} H3 headings.` : 'No H2 headings found.', heads.h2 > 0 ? '' : 'Break the content into sections with clear H2 headings.');
    if (imgs.length === 0) ck(G2, 'Images', 'info', 'No images found in the page code.');
    else ck(G2, 'Image descriptions (alt text)', missingAlt === 0 ? 'pass' : missingAlt / imgs.length > 0.5 ? 'fail' : 'warn', missingAlt === 0 ? `All ${imgs.length} images have alt text.` : `${missingAlt} of ${imgs.length} images have no alt attribute.`, missingAlt === 0 ? '' : 'Add short, descriptive alt text to every meaningful image.');
    ck(G2, 'Links', internal >= 3 ? 'pass' : 'warn', `${internal} internal and ${external} external links.`, internal >= 3 ? '' : 'Link to your other important pages so visitors and search engines can find them.');

    // ---- Technical
    const G3 = 'Technical';
    try {
      const r = await fetchPage(new URL('/robots.txt', origin), { maxBytes: 200000, timeoutMs: 5000, totalMs: 6000 });
      if (r.status !== 200 || !/user-agent/i.test(r.body)) ck(G3, 'robots.txt', 'warn', 'No valid robots.txt file found.', 'Add a robots.txt that allows search engines and points to your sitemap.');
      else {
        let agent = '', blocksAll = false; const maps = [];
        for (const raw of r.body.split(/\r?\n/)) {
          const m = /^([a-z-]+)\s*:\s*(.*)$/i.exec(raw.split('#')[0].trim());
          if (!m) continue;
          const k = m[1].toLowerCase(), v = m[2].trim();
          if (k === 'user-agent') agent = v.toLowerCase(); else if (k === 'disallow' && agent === '*' && v === '/') blocksAll = true; else if (k === 'sitemap') maps.push(v);
        }
        if (blocksAll) ck(G3, 'robots.txt', 'fail', 'robots.txt blocks all search engines from the whole site.', 'Remove the "Disallow: /" rule for all user agents.');
        else ck(G3, 'robots.txt', 'pass', 'robots.txt found and the site is not blocked.');
        if (maps.length) ck(G3, 'XML sitemap', 'pass', `Sitemap listed in robots.txt: ${maps[0]}`);
        else { let ok = false; try { ok = (await fetchPage(new URL('/sitemap.xml', origin), { maxBytes: 20000, timeoutMs: 5000, totalMs: 6000 })).status === 200; } catch {} ck(G3, 'XML sitemap', ok ? 'warn' : 'fail', ok ? 'A sitemap exists at /sitemap.xml but is not listed in robots.txt.' : 'No XML sitemap found.', ok ? 'Add a Sitemap line to robots.txt.' : 'Create an XML sitemap and submit it in Google Search Console.'); }
      }
    } catch { ck(G3, 'robots.txt', 'info', 'We could not read robots.txt.'); }
    const enc = (page.headers.get('content-encoding') || '').toLowerCase();
    ck(G3, 'Compression', /gzip|br|deflate|zstd/.test(enc) ? 'pass' : 'warn', enc ? `Compressed with ${enc}.` : 'No compression detected.', /gzip|br|deflate|zstd/.test(enc) ? '' : 'Turn on gzip or Brotli compression on your server.');
    const kb = Math.round(page.bytes / 1024);
    ck(G3, 'Page code size', kb < 500 ? 'pass' : kb < 1200 ? 'warn' : 'fail', `The page HTML is about ${kb} KB.`, kb < 500 ? '' : 'Reduce page weight by removing unused code and large inline data.');
    if (final.protocol === 'https:') {
      const mixed = [...all('img'), ...all('iframe'), ...all('script'), ...all('link')].filter((n) => { const s = n.getAttribute('src') || n.getAttribute('href') || ''; return /^http:\/\//i.test(s) && (n.tagName !== 'LINK' || (n.getAttribute('rel') || '').includes('stylesheet')); }).length;
      ck(G3, 'Mixed content', mixed ? 'fail' : 'pass', mixed ? `${mixed} resource(s) load over insecure http.` : 'No insecure resources found.', mixed ? 'Change every http:// resource address to https://.' : '');
    }
    if (wc < 40 && scriptCount > 5) ck(G3, 'JavaScript rendering', 'warn', 'The page has very little text in its HTML but many scripts. Content may be added by JavaScript.', 'Make sure important content is in the HTML that search engines receive.');

    // ---- Structured data and sharing
    const G4 = 'Structured data and sharing';
    if (types.size) ck(G4, 'Structured data', 'pass', `Found: ${[...types].slice(0, 8).join(', ')}.`);
    else ck(G4, 'Structured data', 'warn', 'No JSON-LD structured data found.', 'Add Organization, LocalBusiness or Hotel markup so search engines understand your business.');
    if (ld.includes(null)) ck(G4, 'Structured data errors', 'warn', 'Some structured data could not be read (invalid JSON).', 'Validate it with Google\'s Rich Results Test.');
    const og = ['og:title', 'og:description', 'og:image'].filter((p) => !prop(p));
    ck(G4, 'Social sharing tags', og.length === 0 ? 'pass' : og.length === 3 ? 'warn' : 'info', og.length === 0 ? 'Open Graph title, description and image are present.' : `Missing: ${og.join(', ')}.`, og.length === 0 ? '' : 'Add Open Graph tags so links look good when shared.');
    ck(G4, 'Favicon', rel('icon').length || rel('shortcut').length ? 'pass' : 'info', rel('icon').length || rel('shortcut').length ? 'A favicon is set.' : 'No favicon link found.', 'Add a favicon so your site is recognisable in browser tabs and search results.');

    // ---- International
    const hl = links.filter((l) => l.getAttribute('hreflang'));
    ck('International', 'Language versions (hreflang)', hl.length ? 'pass' : 'info', hl.length ? `${hl.length} hreflang tags found.` : 'No hreflang tags. This is only needed if you have pages for different countries or languages.', '');

    // ---- Security headers
    const G5 = 'Security headers';
    const h = (n) => page.headers.get(n);
    if (final.protocol === 'https:') ck(G5, 'HSTS', h('strict-transport-security') ? 'pass' : 'info', h('strict-transport-security') ? 'Strict-Transport-Security is set.' : 'No HSTS header.', 'Add Strict-Transport-Security to keep visitors on https.');
    ck(G5, 'Content type protection', h('x-content-type-options') ? 'pass' : 'info', h('x-content-type-options') ? 'X-Content-Type-Options is set.' : 'No X-Content-Type-Options header.', 'Add X-Content-Type-Options: nosniff.');
    ck(G5, 'Clickjacking protection', h('x-frame-options') || /frame-ancestors/i.test(h('content-security-policy') || '') ? 'pass' : 'info', h('x-frame-options') ? 'X-Frame-Options is set.' : 'No frame protection header found.', 'Add X-Frame-Options or a frame-ancestors rule.');

    const counts = { pass: 0, warn: 0, fail: 0, info: 0 };
    checks.forEach((c) => counts[c.status]++);
    send(res, 200, { url: final.href, status: page.status, counts, checks });
  } catch (e) {
    send(res, 200, { error: e && e.message ? e.message : 'Something went wrong while checking that website.' });
  }
}
