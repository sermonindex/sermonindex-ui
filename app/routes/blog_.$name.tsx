import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import path from 'path';
import invariant from 'tiny-invariant';
import fs from 'fs/promises';
import matter from 'gray-matter';

import { SiPage } from '~/components/si-page';
import MarkdownRenderer from '~/components/markdown';
import { BLOG_POSTS_DIR, Post } from '~/api/blog';
import { SiSection } from '~/components/section';
import { hasContent } from '~/common/sanitize';

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
      frontmatter: data as Post,
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
      <SiSection>
        <article className="prose dark:prose-invert lg:prose-xl max-w-none flow-root">
          {hasContent(frontmatter.imgUrl) && (
            <img
              src={frontmatter.imgUrl}
              alt={frontmatter.title}
              className="h-64 md:h-96 float-right ml-6 mr-4 my-4 rounded-lg shadow-lg"
            />
          )}
          <MarkdownRenderer markdownContent={content} />
        </article>
      </SiSection>
    </SiPage>
  );
}
