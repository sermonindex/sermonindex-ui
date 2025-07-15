import { Link } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { BookInfo, MediaType } from '~/api/interfaces';
import { BookCover } from './book-cover';
import DropdownCheckbox from './dropdown-checkbox';
import { DynamicList } from './dynamic-list';

export interface BookListProps {
  books: BookInfo[];
  filters?: Record<string, string | number | null | undefined> | null;
  nextPage?: number | null;
}

export const BookList = ({
  books,
  filters = {},
  nextPage = null,
}: BookListProps) => {
  const [title, setTitle] = useState<string>('');
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>(
    Object.values(MediaType),
  );

  const memoizedFilters = useMemo(() => {
    return { ...filters, title, mediaTypes: mediaTypes.join(',') };
  }, [title, mediaTypes]);

  return (
    <div>
      <div className="flex items-center space-x-4">
        <input
          className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
          placeholder="Find a book..."
          onChange={(e) => setTitle(e.target.value.toLowerCase())}
          required
        />
        <DropdownCheckbox
          title="Filter Media"
          shortTitle="Filter"
          options={[MediaType.Text, MediaType.Audio]}
          onFilterChange={(options: string[]) =>
            setMediaTypes(options as MediaType[])
          }
        />
      </div>
      <DynamicList
        items={books}
        baseUrl={'/books'}
        filters={memoizedFilters}
        nextPage={nextPage}
        renderItems={(items) => (
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 pt-4">
            {items.map((book, index) => (
              <Link to={`/books/${book.id}/contents`} key={index}>
                <BookCover book={book} />
              </Link>
            ))}
          </ul>
        )}
      />
    </div>
  );
};
