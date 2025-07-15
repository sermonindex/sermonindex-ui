// Blog posts must all be in this folder. In the future,
// they should be part of the sermon index api, but for
// now they live here.
import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';

export const BLOG_POSTS_DIR = path.resolve(
  process.cwd(),
  'public',
  'markdown-content',
  'blog',
);

// Create a URL-friendly slug from a title string
export const createBlogSlugFromFilename = (filename: string) => {
  return filename.replace(/\.md$/, '');
};

export interface Post {
  slug: string;
  title: string;
  date: string;
  year: string;
  content: string;
  description?: string;
  imgUrl?: string;
  [key: string]: any;
}

export async function getBlogPost(filename: string): Promise<Post | null> {
  const filePath = path.join(BLOG_POSTS_DIR, filename);
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContents);

  if (!data.title || !data.date) {
    console.warn(`Skipping ${filename} due to missing frontmatter.`);
    return null;
  }

  const slug = createBlogSlugFromFilename(filename);
  const year = String(new Date(data.date).getUTCFullYear());

  return {
    slug,
    title: data.title,
    date: data.date,
    year,
    content,
    description: data.description || '',
    imgUrl: data.imgUrl || '',
  } as Post;
}
