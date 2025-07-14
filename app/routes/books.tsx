import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { BookInfo, ListPaginatedResponse, MediaType } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { BookList } from '~/components/book-list';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const books = await fetchApi<ListPaginatedResponse<BookInfo>>(
    `/books?offset=0&limit=25`,
  );

  if ('statusCode' in books) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return books;
}

export default function Index() {
  const books = useLoaderData<typeof loader>();

  return (
    <SiPage>
      <div className="p-3 md:p-8">
        <div className="flex items-center space-x-2 md:space-x-12">
          <img
            className="w-28 h-28 md:w-44 md:h-44 mb-6 md:mb-0 rounded-full object-cover flex-shrink-0"
            src={'https://sermonindex3.b-cdn.net/pdf/cslewis.png'}
            alt={'C.S. Lewis'}
          />
          <div className="flex flex-col mb-2">
            <h3 className="md:text-xl">The world does not need more</h3>
            <h3 className="md:text-xl">
              <span className="text-lg md:text-2xl font-bold">
                Christian literature.
              </span>
            </h3>
            <h3 className="md:text-xl">What it needs is more</h3>
            <h3 className="text-lg md:text-xl">
              <span className="md:text-2xl font-bold"> Christians </span>
              <span className="md:text-2xl italic"> writing </span>
              <span className="md:text-2xl font-bold"> good literature. </span>
            </h3>
            <h3 className="text-lg pl-3 pt-1"> - C.S. Lewis</h3>
          </div>
        </div>
      </div>
      <SiSection title="Books">
        <div className="md:px-4 pb-8">
          <BookList books={books.values} nextPage={books.nextPage} />
        </div>
      </SiSection>
    </SiPage>
  );
}
