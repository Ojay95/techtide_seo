// /api/speed?url=example.com  Mobile speed and quality scores from Google PageSpeed Insights.
import { normalizeUrl, assertPublic, rateLimited, send } from './_lib/safe.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return send(res, 405, { error: 'Use GET.' });
    if (rateLimited(req, 15)) return send(res, 429, { error: 'Too many checks from your connection. Please try again later.' });
    const url = normalizeUrl(new URL(req.url, 'http://local').searchParams.get('url'));
    await assertPublic(url.hostname);
    const params = new URLSearchParams([['url', url.href], ['strategy', 'mobile'], ['category', 'performance'], ['category', 'accessibility'], ['category', 'seo'], ['category', 'best-practices']]);
    if (process.env.PAGESPEED_API_KEY) params.set('key', process.env.PAGESPEED_API_KEY);
    const r = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' + params, { signal: AbortSignal.timeout(55000) });
    if (!r.ok) return send(res, 200, { error: r.status === 429 ? 'The speed service is busy. Please try again in a minute.' : 'The speed test could not run for this page.' });
    const j = await r.json();
    const lh = j.lighthouseResult;
    if (!lh) return send(res, 200, { error: 'The speed test returned no result for this page.' });
    const score = (k) => (lh.categories?.[k]?.score != null ? Math.round(lh.categories[k].score * 100) : null);
    const a = lh.audits || {};
    const m = (id) => ({ value: a[id]?.numericValue ?? null, display: a[id]?.displayValue || '' });
    const f = j.loadingExperience?.metrics || {};
    const opps = Object.values(a)
      .filter((x) => x.details?.type === 'opportunity' && x.score != null && x.score < 0.9)
      .sort((p, q) => (q.details.overallSavingsMs || 0) - (p.details.overallSavingsMs || 0))
      .slice(0, 5)
      .map((x) => ({ title: x.title, display: x.displayValue || '' }));
    send(res, 200, {
      scores: { performance: score('performance'), accessibility: score('accessibility'), seo: score('seo'), bestPractices: score('best-practices') },
      lab: { lcp: m('largest-contentful-paint'), cls: m('cumulative-layout-shift'), tbt: m('total-blocking-time'), fcp: m('first-contentful-paint'), si: m('speed-index') },
      field: { lcp: f.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null, inp: f.INTERACTION_TO_NEXT_PAINT?.percentile ?? null, cls: f.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile != null ? f.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100 : null },
      opportunities: opps,
    });
  } catch (e) {
    send(res, 200, { error: e && e.message ? e.message : 'The speed test failed.' });
  }
}
