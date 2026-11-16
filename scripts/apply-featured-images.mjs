// Run once from the project folder:  node scripts/apply-featured-images.mjs
// Safe to run again: it skips anything already done and backs up files it rewrites (*.bak).
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rd = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const wr = (p, s) => fs.writeFileSync(path.join(root, p), s);
const has = (p) => fs.existsSync(path.join(root, p));
const log = (m) => console.log(m);
function backup(p) { const b = path.join(root, p + '.bak'); if (!fs.existsSync(b)) fs.copyFileSync(path.join(root, p), b); }
function edit(p, label, fn) {
  if (!has(p)) return log(`SKIP  ${p} (not found)`);
  const before = rd(p); const after = fn(before);
  if (after === before) return log(`OK    ${label}: already done or nothing to change`);
  backup(p); wr(p, after); log(`DONE  ${label}`);
}

// 1. Content schema: optional "image" field
const cfg = has('src/content.config.ts') ? 'src/content.config.ts' : 'src/content/config.ts';
edit(cfg, 'content schema', (s) => s.includes('image: z.string()') ? s : s.replace('draft: z.boolean().default(false),', 'draft: z.boolean().default(false),\n  image: z.string().optional(),'));

// 2. Keystatic admin: image field (+ AI and SEO category if missing)
edit('keystatic.config.ts', 'admin image field', (s) => {
  if (!s.includes("image: fields.text")) s = s.replace("  content: fields.mdx({ label: 'Content' }),", "  image: fields.text({ label: 'Featured image path (for example /images/featured/blog/my-post.jpg)' }),\n  content: fields.mdx({ label: 'Content' }),");
  if (!s.includes("'AI and SEO'")) s = s.replace("{ label: 'Pricing', value: 'Pricing' },", "{ label: 'Pricing', value: 'Pricing' }, { label: 'AI and SEO', value: 'AI and SEO' },");
  return s;
});

// 3. Post cards: show the featured image, fall back to the old illustration
const card = `---
import Visual from './Visual.astro';
const { entry, kind, featured = false } = Astro.props;
const d = entry.data;
const kinds: Record<string, string> = { 'SEO basics': 'chart', 'Local SEO': 'heat', 'Technical SEO': 'tech', 'On-page SEO': 'serp', Content: 'bars', 'Link building': 'net', Pricing: 'bars', 'AI and SEO': 'net' };
const date = d.published ?? d.updated;
const when = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const minutes = Math.max(1, Math.round((entry.body ?? '').split(/\\s+/).length / 200));
---
<a class={\`post-card\${featured ? ' featured' : ''}\`} href={\`/\${kind}/\${entry.id}/\`} data-cat={d.category}>
  {d.image ? (
    <div class="pc-vis pc-img"><img src={d.image} alt="" width="1200" height="630" loading={featured ? 'eager' : 'lazy'} decoding="async" /></div>
  ) : (
    <div class="pc-vis gridbg"><div class="pc-vis-in"><Visual kind={kinds[d.category] ?? 'chart'} /></div></div>
  )}
  <div class="pc-body">
    <span class="pill">{d.category}</span>
    <h3>{d.title}</h3>
    <p class="m">{d.description}</p>
    <div class="mono m">{when} · {minutes} min read</div>
    <span class="pc-more">{kind === 'guides' ? 'Read the guide' : 'Read the article'} →</span>
  </div>
</a>
`;
if (has('src/components/PostCard.astro')) {
  const cur = rd('src/components/PostCard.astro');
  if (cur.includes('pc-img')) log('OK    post card: already done');
  else { backup('src/components/PostCard.astro'); wr('src/components/PostCard.astro', card); log('DONE  post card'); }
}

// 4. Article page: hero image, image in the Article schema, share image
edit('src/layouts/ArticleLayout.astro', 'article page', (s) => {
  if (!s.includes('art-hero')) s = s.replace('<article>\n', '<article>\n      {d.image && <figure class="art-hero"><img src={d.image} alt={d.title} width="1200" height="630" fetchpriority="high" decoding="async" /></figure>}\n');
  if (!s.includes('image: d.image')) s = s.replace('headline: d.title,', 'headline: d.title, image: d.image ? [`${SITE.url}${d.image}`] : undefined,');
  if (!s.includes('image={d.image}')) s = s.replace('schema={schema}>', 'schema={schema} image={d.image}>');
  return s;
});

// 5. Page head: Open Graph and Twitter share image (default image for pages without one)
edit('src/layouts/Base.astro', 'share image tags', (s) => {
  if (!s.includes('ogImage')) {
    s = s.replace('noindex = false } = Astro.props;', 'noindex = false, image } = Astro.props;');
    s = s.replace('const canonical = new URL(Astro.url.pathname, SITE.url).href;', "const canonical = new URL(Astro.url.pathname, SITE.url).href;\nconst ogImage = new URL(image ?? '/images/og-default.jpg', SITE.url).href;");
    s = s.replace('<meta name="twitter:card" content="summary" />', '<meta name="twitter:card" content="summary_large_image" />\n    <meta property="og:image" content={ogImage} />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:image" content={ogImage} />');
  }
  return s;
});

// 6. Styles
edit('src/styles/global.css', 'styles', (s) => s.includes('.pc-img') ? s : s + `
/* featured images */
.pc-vis.pc-img{display:block;height:auto;padding:0;aspect-ratio:1200/630;overflow:hidden;background:#0A2540}
.pc-vis.pc-img img{width:100%;height:100%;object-fit:cover;display:block}
.post-card.featured .pc-vis.pc-img{aspect-ratio:auto;min-height:320px}
.art-hero{margin:0 0 32px;max-width:720px}
.art-hero img{width:100%;height:auto;display:block;border-radius:16px;border:1px solid var(--line)}
`);

// 7. Add the image line to every post and guide that has a matching file
let added = 0, missing = [];
for (const kind of ['blog', 'guides']) {
  const dir = path.join(root, 'src/content', kind); if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => /\.mdx?$/.test(x))) {
    const slug = f.replace(/\.mdx?$/, ''); const rel = `/images/featured/${kind}/${slug}.jpg`;
    const fp = path.join(dir, f); const t = fs.readFileSync(fp, 'utf8');
    if (!t.startsWith('---')) continue;
    const head = t.slice(0, t.indexOf('\n---', 3));
    if (/^image:/m.test(head)) continue;
    if (!has('public' + rel)) { missing.push(`${kind}/${slug}`); continue; }
    fs.writeFileSync(fp, t.replace(/^---\r?\n/, `---\nimage: "${rel}"\n`)); added++;
  }
}
log(`DONE  featured image added to ${added} posts and guides`);
if (missing.length) log(`NOTE  no image file yet for: ${missing.join(', ')}`);
log('\nNext: run  npm run dev  and open /blog/ to check, then commit and push.');
