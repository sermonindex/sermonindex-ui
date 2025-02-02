import { Link } from 'react-router-dom';
import { isOldTestament } from '~/common/get-bible-book-id.fn';
import { BibleBook } from '~/api/interfaces';

export interface BookListProps {
  books: BibleBook[];
  translation: string;
}

// Note that the styling of the topic list is identical to that of the speaker list.
// these should probably use a single shared component or at least share the list styles.
export const BookList = ({ books, translation }: BookListProps) => {
  const group: { [key: string]: BibleBook[] } = {};

  const booksGrouped = books.reduce((grouped, book) => {
    // todo
    const canon = isOldTestament(book.name) ? 'Old Testament' : 'New Testament';
    if (!grouped[canon]) {
      grouped[canon] = [];
    }
    grouped[canon].push(book);
    return grouped;
  }, group);

  return (
    <div className="p-2">
      {Object.entries(booksGrouped).map(([canon, group]) => {
        return (
          <div key={canon}>
            <h2 className="text-lg pt-4 font-semibold capitalize border-slate-600 border-b-2">
              {canon}
            </h2>
            <div
              key={`${canon}-columns`}
              className="w-full pt-2 columns-1 sm:columns-1 md:columns-2 lg:columns-3 xl:columns-4"
            >
              <ul>
                {group.map((book) => (
                  <Link key={book.id} to={`/bible/${translation}/${book.id}/1`}>
                    <li
                      className="group flex items-center h-8 text-sm justify-between pl-2 my-1 rounded-md hover:cursor-pointer hover:underline hover:bg-gray-300 dark:hover:bg-gray-700 break-inside-avoid-column"
                      key={book.name}
                    >
                      <span>{book.name}</span>
                      <span className="hidden group-hover:block transition-opacity duration-300">
                        <svg
                          className="h-6 w-6 text-slate-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};
