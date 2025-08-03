import { LoaderFunctionArgs } from '@remix-run/node';
import { MetaFunction, Outlet, useLoaderData } from '@remix-run/react';
import { Book } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { getMetaTags } from '~/common/get-meta-tags';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  const book = await fetchApi<Book>(`/books/id/${id}`);

  if ('statusCode' in book) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { book };
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title = `${data?.book.title} by ${data?.book.contributorFullName}`;
  const description = `Explore the book "${data?.book.title}" by ${data?.book.contributorFullName} on SermonIndex.`;
  const url = `https://sermonindex.net/books/${params.id}/contents`;

  return getMetaTags({
    title,
    description,
    url,
  });
};

export default function Index() {
  const { book } = useLoaderData<typeof loader>();

  return <Outlet context={{ book }} />;
}
