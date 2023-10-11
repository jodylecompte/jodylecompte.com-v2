import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import type { Post } from '../types';

export const loadPosts = async (): Promise<Post[]> => {
  const postsDirectory = path.join(process.cwd(), 'src/pages/blog');
  const filenames = await fs.readdir(postsDirectory);
  const mdxFiles = filenames.filter((fn) => fn.endsWith('.mdx'));

  const posts = await Promise.all(
    mdxFiles.map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data } = matter(fileContent);
      return {
        filename: filename.replace('.mdx', ''),
        title: data.title,
        summary: data.summary,
        date: new Date(data.date),
      };
    })
  );

  return posts;
};
