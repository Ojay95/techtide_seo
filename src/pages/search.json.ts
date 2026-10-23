import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SERVICES } from '../data/services';

// Static search index, built at deploy time and fetched by the header search on first open.
export const GET: APIRoute = async () => {
  const strip = (s = '') =>
    s.replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>|[#*_>`|-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1500);

  const [blog, guides] = await Promise.all([getCollection('blog'), getCollection('guides')]);
  const items = [
    ...SERVICES.map((s) => ({ t: s.name, d: s.short, u: `/services/${s.slug}/`, k: 'Service', b: '' })),
    { t: 'Google Business Profile Setup', d: 'Set up and optimise your Google Business Profile to win the map pack.', u: '/services/local-seo/', k: 'Service', b: 'GBP maps local' },
    ...guides.filter((e) => !e.data.draft).map((e) => ({ t: e.data.title, d: e.data.description, u: `/guides/${e.id}/`, k: 'Guide', b: strip(e.body) })),
    ...blog.filter((e) => !e.data.draft).map((e) => ({ t: e.data.title, d: e.data.description, u: `/blog/${e.id}/`, k: 'Blog', b: strip(e.body) })),
    { t: 'Free SEO audit', d: 'Get a free, prioritised list of what to fix on your website.', u: '/free-seo-audit/', k: 'Page', b: '' },
    { t: 'How we work', d: 'Our audit, fix, grow and report process.', u: '/how-we-work/', k: 'Page', b: '' },
    { t: 'About TechTide SEO', d: 'Who we are and how we help businesses get found.', u: '/about/', k: 'Page', b: '' },
    { t: 'Contact', d: 'Talk to us about your website and search goals.', u: '/contact/', k: 'Page', b: '' },
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
};
