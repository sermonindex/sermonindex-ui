import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {
  useLoaderData,
  useParams,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import path from 'path';
import invariant from 'tiny-invariant';

import { SiPage } from '~/components/si-page';
import MarkdownRenderer from '~/components/markdown';
import fs from 'fs/promises';
import { SiSection } from '~/components/section';

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
  if (!data || !data.slug) {
    return [
      { title: 'Markdown Page Not Found' },
      {
        name: 'description',
        content: `Could not load markdown page for ${params.file}.`,
      },
    ];
  }
  // Simple title case for the slug
  const title = data.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return [
    { title: `${title} | SermonIndex` }, // Adjust your site name
    { name: 'description', content: `Viewing content for ${title}.` },
  ];
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

export function ErrorBoundary() {
  const error = useRouteError();
  const params = useParams();

  let errorTitle = 'Oh no! Something went wrong.';
  let errorMessage =
    'There was an error loading this page. Please try again later.';

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} - ${error.statusText || 'Page Error'}`;
    errorMessage =
      error.data?.message || `Could not load the page for "${params.file}".`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    // Log the stack trace for server-side errors during development/debugging
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
          <a href="/" className="text-blue-500 hover:underline">
            Go back to Homepage
          </a>
        </p>
      </div>
    </SiPage>
  );
}
