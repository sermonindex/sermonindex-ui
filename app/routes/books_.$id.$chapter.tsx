import { LoaderFunctionArgs } from '@remix-run/node';
import {
  Link,
  useLoaderData,
  useMatches,
  useOutletContext,
} from '@remix-run/react';
import { IconContext } from 'react-icons';
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from 'react-icons/fa';
import { Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { MiniPlayer } from '~/components/media/player';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id, chapter: chapterNumber } = params;

  const chapter = await fetchApi<any>(
    `/books/id/${id}/chapter/${chapterNumber}`,
  );

  if ('statusCode' in chapter) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { chapter };
}

export default function Index() {
  const { chapter } = useLoaderData<typeof loader>();
  const { book } = useOutletContext<{ book: any }>();
  const matches = useMatches();
  // console.log(matches);

  const isAudioBook = !!chapter.streamUrl;

  const previousChapter =
    chapter.number === 1 ? book.chapters.length : chapter.number - 1;
  const nextChapter =
    chapter.number === book.chapters.length ? 1 : chapter.number + 1;

  return (
    <SiPage>
      <div className="flex pt-6">
        <div className="flex-1 px-4">
          <div className="flex w-full items-center justify-between space-x-4 md:space-x-12 pb-4 md:pb-8">
            <span className="hover:underline hover:cursor-pointer md:pl-4">
              <Link to={`/books/${book.id}/${previousChapter}`}>
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
              <Link to={`/books/${book.id}/${nextChapter}`}>
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
          <div className="pt-4 pb-8 px-4">
            {isAudioBook && <MiniPlayer sermon={chapter as Sermon} />}
            <h3 className="text-lg font-semibold pb-2">{chapter.title}</h3>
            {isAudioBook && (
              <p className="whitespace-pre-line">{chapter.text}</p>
            )}
            {!isAudioBook && (
              <div
                className="custom-html"
                dangerouslySetInnerHTML={{ __html: chapter.text }}
              />
            )}
          </div>
        </div>

        {/* Uncomment this section if you want to display the table of contents */}
        {/* Unfortunetly, the margins are much too large for this to look good. 😞 */}
        {/* <aside className="w-80 pl-4 pb-8 bg-si-light hidden xl:block">
          <h2 className="font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-3">
            {book.chapters.map((chapter: any, index: number) => (
              <li key={index}>
                <Link
                  to={`/books/${book.id}/${index + 1}`}
                  className="over:underline"
                >
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside> */}
      </div>
    </SiPage>
  );
}
