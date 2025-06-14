import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from '@remix-run/react';
import path from 'path';
import invariant from 'tiny-invariant';
import fs from 'fs/promises';
import matter from 'gray-matter';

import { SiPage } from '~/components/si-page';
import MarkdownRenderer from '~/components/markdown';

export interface PostFrontmatter {
  title: string;
  date: string;
  author?: string;
  description?: string;
  [key: string]: any;
}

const BLOG_POSTS_DIR = path.resolve(
  process.cwd(),
  'public',
  'markdown-content',
  'blog',
);

const createSlugFromFilename = (filename: string) => {
  return filename.replace(/\.md$/, '');
};

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.name, 'Expected params.name to be defined');
  const requestedSlug = params.name;

  const files = await fs.readdir(BLOG_POSTS_DIR);

  // Find the filename that matches the requested slug
  const matchingFilename = files.find(
    (filename) => createSlugFromFilename(filename) === requestedSlug,
  );

  if (!matchingFilename) {
    throw json(
      { message: `Blog post not found for "${requestedSlug}"` },
      { status: 404 },
    );
  }

  const filePath = path.join(BLOG_POSTS_DIR, matchingFilename);

  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    // Use gray-matter to parse the file into frontmatter (data) and content
    const { data, content } = matter(fileContents);

    // Validate that required frontmatter exists
    invariant(
      data.title,
      `${matchingFilename} needs a title in its frontmatter.`,
    );
    invariant(
      data.date,
      `${matchingFilename} needs a date in its frontmatter.`,
    );

    return json({
      frontmatter: data as PostFrontmatter,
      content,
    });
  } catch (error) {
    console.error(`Error processing markdown file ${filePath}:`, error);
    if (error instanceof Error) {
      throw json({ message: error.message }, { status: 500 });
    }
    throw json({ message: 'Failed to load blog post.' }, { status: 500 });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.frontmatter) {
    return [{ title: 'Blog Post Not Found' }];
  }
  const { frontmatter } = data;
  return [
    { title: `${frontmatter.title} | SermonIndex Blog` },
    { name: 'description', content: frontmatter.description },
  ];
};

export default function BlogPostPage() {
  const { frontmatter, content } = useLoaderData<typeof loader>();

  return (
    <SiPage post={frontmatter}>
      <article className="prose dark:prose-invert lg:prose-xl max-w-none">
        <MarkdownRenderer markdownContent={content} />
      </article>
    </SiPage>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const params = useParams();
  let errorTitle = 'Oh no! Something went wrong.';
  let errorMessage =
    'There was an error loading this post. Please try again later.';
  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} - ${error.statusText || 'Page Error'}`;
    errorMessage =
      error.data?.message || `Could not load the post for "${params.id}".`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    console.error('ErrorBoundary caught an error:', error);
  }

  return (
    <SiPage>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          {errorTitle}
        </h1>
        <p className="text-lg">{errorMessage}</p>
        <p className="mt-4">
          <a href="/blog" className="text-blue-500 hover:underline">
            Back to Blog
          </a>
        </p>
      </div>
    </SiPage>
  );
}
