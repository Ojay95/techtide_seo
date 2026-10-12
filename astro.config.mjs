import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import rehypeExternalLinks from 'rehype-external-links';

// Adds lazy loading and size hints to images written in Markdown/MDX (prevents layout shift).
function rehypeImages() {
  return (tree) => {
    const walk = (n) => {
      if (n.type === 'element' && n.tagName === 'img') n.properties = { ...n.properties, loading: 'lazy', decoding: 'async', width: 1280, height: 720 };
      (n.children || []).forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://techtideseo.com',
  trailingSlash: 'ignore',
  output: 'static',
  markdown: { rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }], rehypeImages] },
  integrations: [react(), mdx(), keystatic(), sitemap({ filter: (p) => !p.includes('/keystatic') })],
});