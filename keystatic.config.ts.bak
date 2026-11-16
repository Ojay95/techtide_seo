import { config, fields, collection } from '@keystatic/core';

const repo = (import.meta.env.PUBLIC_KEYSTATIC_REPO || 'OWNER/REPO') as `${string}/${string}`;

const schema = {
  title: fields.slug({ name: { label: 'Title' } }),
  metaTitle: fields.text({ label: 'SEO title (optional, under 60 characters)' }),
  description: fields.text({ label: 'Meta description (about 150 characters)', multiline: true, validation: { isRequired: true } }),
  category: fields.select({
    label: 'Category',
    options: [
      { label: 'SEO basics', value: 'SEO basics' }, { label: 'Local SEO', value: 'Local SEO' },
      { label: 'Technical SEO', value: 'Technical SEO' }, { label: 'On-page SEO', value: 'On-page SEO' },
      { label: 'Content', value: 'Content' }, { label: 'Link building', value: 'Link building' }, { label: 'Pricing', value: 'Pricing' },
    ],
    defaultValue: 'SEO basics',
  }),
  published: fields.date({ label: 'Published date' }),
  updated: fields.date({ label: 'Last updated' }),
  draft: fields.checkbox({ label: 'Draft (hidden from the site)', defaultValue: true }),
  content: fields.mdx({ label: 'Content' }),
};

export default config({
  storage: import.meta.env.PROD ? { kind: 'github', repo } : { kind: 'local' },
  ui: { brand: { name: 'TechTide SEO' } },
  collections: {
    guides: collection({ label: 'Guides', slugField: 'title', path: 'src/content/guides/*', format: { contentField: 'content' }, schema }),
    blog: collection({ label: 'Blog posts', slugField: 'title', path: 'src/content/blog/*', format: { contentField: 'content' }, schema }),
  },
});
