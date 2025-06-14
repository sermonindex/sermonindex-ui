import { json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import path from 'path';
import fs from 'fs/promises';
import { SiPage } from '~/components/si-page';
import { SiSection } from '~/components/section';
import { useState } from 'react';
import { GenericList } from '~/components/generic-list';
import matter from 'gray-matter';

// Blog posts must all be in this folder. In the future,
// they should be part of the sermon index api, but for
// now they live here.
const BLOG_POSTS_DIR = path.resolve(
  process.cwd(),
  'public',
  'markdown-content',
  'blog',
);

// Create a URL-friendly slug from a title string
const createSlugFromFilename = (filename: string) => {
  return filename.replace(/\.md$/, '');
};

interface Post {
  slug: string;
  title: string;
  date: string;
  year: string;
  description?: string;
}

export async function loader() {
  const files = await fs.readdir(BLOG_POSTS_DIR);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.md'))
      .map(async (filename) => {
        const filePath = path.join(BLOG_POSTS_DIR, filename);
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(fileContents);

        if (!data.title || !data.date) {
          console.warn(`Skipping ${filename} due to missing frontmatter.`);
          return null;
        }

        const slug = createSlugFromFilename(filename);
        const year = String(new Date(data.date).getUTCFullYear());

        return {
          slug,
          title: data.title,
          date: data.date,
          year,
          description: data.description || '',
        } as Post;
      }),
  );

  const validPosts = posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));

  return json({ posts: validPosts });
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Blog | SermonIndex' },
    {
      name: 'description',
      content: 'A collection of blog posts on SermonIndex',
    },
  ];
};

// group posts by year
const getPostsGroupedByYear = (posts: Post[]) => {
  return posts.reduce((grouped, post) => {
    const year = post.year;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(post);
    return grouped;
  }, {} as { [key: string]: Post[] });
};

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  const filteredPosts = posts.filter((c: Post) =>
    c.title.toLowerCase().includes(filter),
  );

  return (
    <SiPage>
      <SiSection title="Blog">
        <input
          className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-black"
          placeholder="Find a post..."
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
        />
        <GenericList<Post>
          items={filteredPosts}
          getGroupedItems={getPostsGroupedByYear}
          getGroupKeyName={(key: string) => key}
          getItemId={(post: Post) => post.slug}
          getItemName={(post: Post) => post.title}
          getItemLink={(post: Post) => `/blog/${post.slug}`}
          getItemSubName={(post: Post) =>
            new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })
          }
          sortOrder={'desc'}
        />
      </SiSection>
    </SiPage>
  );
}
