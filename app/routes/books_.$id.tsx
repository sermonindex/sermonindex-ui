import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Book } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';

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

export default function Index() {
  const { book } = useLoaderData<typeof loader>();

  return <Outlet context={{ book }} />;
}
