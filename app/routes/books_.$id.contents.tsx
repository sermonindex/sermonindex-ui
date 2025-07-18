import { Link, useOutletContext } from '@remix-run/react';
import { IconContext } from 'react-icons';
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from 'react-icons/fa';
import { SiPage } from '~/components/si-page';

export default function Index() {
  const { book } = useOutletContext<{ book: any }>();

  return (
    <SiPage book={book}>
      <div className="flex py-6">
        <div className="flex-1 px-2 md:px-4">
          <div className="flex w-full items-center justify-between space-x-4 md:space-x-12 pb-4 md:pb-8">
            <span className="hover:underline hover:cursor-pointer md:pl-4">
              <Link
                to={`/books/${book.id}/contents/${book.chapters.length - 1}`}
              >
                <IconContext.Provider
                  value={{
                    className:
                      'w-6 h-6 md:w-7 md:h-7 text-neutral-600 dark:text-neutral-200',
                  }}
                >
                  <FaRegArrowAltCircleLeft />
                </IconContext.Provider>
              </Link>
            </span>

            <div className="flex flex-col items-center">
              <h1 className="text-lg md:text-2xl font-semibold text-center">
                {book.title}
              </h1>
              <h3 className="">By {book.contributor.fullName}</h3>
            </div>
            <span className="hover:underline hover:cursor-pointer md:pr-4">
              <Link to={`/books/${book.id}/contents/1`}>
                <IconContext.Provider
                  value={{
                    className:
                      'w-6 h-6 md:w-7 md:h-7 text-neutral-600 dark:text-neutral-200',
                  }}
                >
                  <FaRegArrowAltCircleRight />
                </IconContext.Provider>
              </Link>
            </span>
          </div>
          <div className="pt-2 md:pt-4 md:px-4">
            <h2 className="text-lg font-semibold pb-2">Table of Contents</h2>
            <ul className="space-y-2 md:space-y-3">
              {book.chapters.map((chapter: any, index: number) => (
                <li
                  key={index}
                  className="border-l-4 border-neutral-400 pl-4 py-1"
                >
                  <Link
                    to={`/books/${book.id}/contents/${index + 1}`}
                    className="hover:underline"
                    content={book}
                  >
                    {chapter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SiPage>
  );
}
