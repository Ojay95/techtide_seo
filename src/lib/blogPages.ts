import { getCollection } from 'astro:content';

export const PAGE_SIZE = 9;

export async function getSortedPosts() {
  const when = (e: any) => (e.data.published ?? e.data.updated).valueOf();
  return (await getCollection('blog'))
    .filter((e) => !e.data.draft)
    .sort((a, b) => when(b) - when(a));
}

export const pageUrl = (p: number) => (p === 1 ? '/blog/' : `/blog/${p}/`);
