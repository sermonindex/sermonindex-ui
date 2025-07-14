import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useOutletContext } from '@remix-run/react';
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
  // const matches = useMatches();

  const isAudioBook = !!chapter.streamUrl;

  const previousChapter =
    chapter.number === 1 ? book.chapters.length : chapter.number - 1;
  const nextChapter =
    chapter.number === book.chapters.length ? 1 : chapter.number + 1;

  return (
    <SiPage>
      <div className="flex py-6">
        <div className="flex-1 px-2 md:px-4">
          <div className="flex w-full items-center justify-between space-x-4 md:space-x-12 pb-4 md:pb-8">
            <span className="hover:underline hover:cursor-pointer md:pl-4">
              <Link to={`/books/${book.id}/contents/${previousChapter}`}>
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
              <h3>By {book.contributor.fullName}</h3>
            </div>
            <span className="hover:underline hover:cursor-pointer md:pr-4">
              <Link to={`/books/${book.id}/contents/${nextChapter}`}>
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
            {isAudioBook && <MiniPlayer sermon={chapter as Sermon} />}
            <h3 className="text-lg font-semibold pb-2">{chapter.title}</h3>
            <div
              className="custom-html whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: chapter.text }}
            />
          </div>
        </div>
      </div>
    </SiPage>
  );
}
