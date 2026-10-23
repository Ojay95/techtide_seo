import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import rehypeExternalLinks from 'rehype-external-links';


// The admin only runs on your own computer (npm run dev). The live site is plain static pages.
const isDev = process.argv.includes('dev');

// Adds lazy loading and size hints to images written in Markdown/MDX (prevents layout shift).
function rehypeImages() {
  return (tree) => {
    const walk = (n) => {
      if (n.type === 'element' && n.tagName === 'img') {
        const alt = String(n.properties?.alt || '').replace(/^\s*screenshot placeholder:\s*/i, '');
        n.properties = { ...n.properties, alt: alt ? alt[0].toUpperCase() + alt.slice(1) : alt, loading: 'lazy', decoding: 'async', width: 1280, height: 720 };
      }
      (n.children || []).forEach(walk);
    };
    walk(tree);
  };
}

// Links the first plain-text mention of "Google Business Profile" in each article to the service page.
function rehypeGbpLink() {
  const SKIP = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'figcaption']);
  const RE = /Google Business Profile/i;
  return (tree) => {
    let done = false;
    const walk = (n) => {
      if (done || !n.children) return;
      for (let i = 0; i < n.children.length && !done; i++) {
        const c = n.children[i];
        if (c.type === 'element') { if (!SKIP.has(c.tagName)) walk(c); continue; }
        if (c.type !== 'text') continue;
        const m = RE.exec(c.value);
        if (!m) continue;
        const before = c.value.slice(0, m.index), after = c.value.slice(m.index + m[0].length);
        const link = { type: 'element', tagName: 'a', properties: { href: '/services/google-business-profile-setup/' }, children: [{ type: 'text', value: m[0] }] };
        n.children.splice(i, 1, ...[before && { type: 'text', value: before }, link, after && { type: 'text', value: after }].filter(Boolean));
        done = true;
      }
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://techtideseo.com',
  trailingSlash: 'ignore',
  output: 'static',
  markdown: { rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }], rehypeImages, rehypeGbpLink] },
  integrations: [react(), mdx(), ...(isDev ? [keystatic()] : []), sitemap({ filter: (p) => !p.includes('/keystatic') })],
});