import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import path from 'path';
import invariant from 'tiny-invariant';

import fs from 'fs/promises';
import { getMetaTags } from '~/common/get-meta-tags';
import MarkdownRenderer from '~/components/markdown';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';

const MARKDOWN_FILES_DIR = path.resolve(
  process.cwd(),
  'public',
  'markdown-content',
);

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.file, 'Expected params.file to be defined');
  const slug = params.file;

  // Basic sanitization: replace non-alphanumeric characters (excluding hyphen/underscore)
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '');
  if (safeSlug !== slug) {
    throw json({ message: `Invalid slug format: ${slug}` }, { status: 400 });
  }

  const filePath = path.join(MARKDOWN_FILES_DIR, `${safeSlug}.md`);

  try {
    const markdownContent = await fs.readFile(filePath, 'utf-8');
    return json({ markdownContent, slug: safeSlug });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File not found
      throw json(
        { message: `Markdown file not found for "${safeSlug}"` },
        { status: 404 },
      );
    }
    // Other server errors
    console.error(`Error reading markdown file ${filePath}:`, error);
    throw json(
      { message: 'Failed to load markdown content.' },
      { status: 500 },
    );
  }
}

// Meta function for SEO (page title, description, etc.)
export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title =
    data?.slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') ?? 'Info';
  const description = `View the SermonIndex ${title} page.`;
  const url = `https://sermonindex.net/md/${data?.slug}`;

  return getMetaTags({
    title,
    description,
    url,
  });
};

export default function MarkdownSlugPage() {
  const { markdownContent } = useLoaderData<typeof loader>();

  return (
    <SiPage>
      <SiSection>
        <MarkdownRenderer markdownContent={markdownContent} />
      </SiSection>
    </SiPage>
  );
}
