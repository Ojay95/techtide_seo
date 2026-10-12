import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const schema = z.object({
  title: z.string(),
  metaTitle: z.string().optional(),
  description: z.string(),
  category: z.string().default('SEO basics'),
  published: z.coerce.date().optional(),
  updated: z.coerce.date(),
  draft: z.boolean().default(false),
});

export const collections = {
  guides: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }), schema }),
  blog: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }), schema }),
};
