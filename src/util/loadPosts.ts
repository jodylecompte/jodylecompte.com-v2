import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import matter from 'gray-matter';

import type { Post } from '../types';

export const loadPosts = async (): Promise<Post[]> => {
  const postsDirectory = path.join(process.cwd(), 'src/pages/blog');

  // Use glob to get all .mdx files recursively
  const mdxFiles = glob.sync('**/*.mdx', {
    cwd: postsDirectory,
  });

  const posts: Post[] = [];

  for (const filePath of mdxFiles) {
    const absoluteFilePath = path.join(postsDirectory, filePath);
    const fileContent = await fs.readFile(absoluteFilePath, 'utf8');
    const { data } = matter(fileContent);

    // Ensure the slug exists in the front matter
    if (!data.slug) {
      throw new Error(`Slug is missing in ${filePath}`);
    }

    posts.push({
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      publishDate: new Date(data.publishDate),
    });
  }

  // Sort the posts by date (from most recent first to oldest)
  return posts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
};
