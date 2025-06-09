import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ListResponse, MediaType } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { BookCover } from '~/components/book-cover';
import DropdownCheckbox from '~/components/dropdown-checkbox';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const books = await fetchApi<ListResponse<any>>(`/books`);

  if ('statusCode' in books) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return books;
}

export default function Index() {
  const books = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>(
    Object.values(MediaType),
  );

  return (
    <SiPage>
      <div className="p-3 md:p-8">
        <div className="flex items-center space-x-6">
          <img
            className="hidden md:inline md:w-32 md:h-32 rounded-full object-cover flex-shrink-0"
            src={'https://sermonindex3.b-cdn.net/pdf/cslewis.png'}
            alt={'C.S. Lewis'}
          />
          <div className="flex flex-col mb-2">
            <h3 className="md:text-xl">
              The world does not need more{' '}
              <span className="text-xl md:text-2xl font-bold">
                Christian literature.
              </span>
            </h3>
            <h3 className="text-lg md:text-xl">
              What it needs is more
              <span className="text-xl md:text-2xl font-bold">
                {' '}
                Christians{' '}
              </span>
              <span className="text-xl md:text-2xl italic"> writing </span>
              <span className="text-xl md:text-2xl font-bold">
                {' '}
                good literature.{' '}
              </span>
            </h3>
            <h3 className="text-lg pl-3 pt-1"> - C.S. Lewis</h3>
          </div>
        </div>
      </div>

      <div className="px-2 md:px-4 pb-8">
        <div className="flex items-center space-x-4">
          <input
            className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
            placeholder="Find a book..."
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            required
          />
          <DropdownCheckbox
            title="Filter Media"
            options={[MediaType.Text, MediaType.Audio]}
            onFilterChange={(options: string[]) =>
              setMediaTypes(options as MediaType[])
            }
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 pt-4">
          {books.values
            .filter(
              (b) =>
                b.title.toLowerCase().includes(filter) &&
                mediaTypes.includes(b.mediaType),
            )
            .map((book, index) => (
              <Link to={`/books/${book.id}/1`} key={index}>
                <BookCover book={book} />
              </Link>
            ))}
        </div>
      </div>
    </SiPage>
  );
}
