import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { BibleChapter } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { OsisToBookName } from '~/common/bible-constants';
import { getBibleBookId } from '~/common/get-bible-book-id.fn';
import { StandardHeader } from '~/common/section';
import { formatBibleChapter } from '~/components/bible-chapter';
import SiPage from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const { translation, book, chapter } = params;
  const bookId = getBibleBookId(book);

  const result = await fetchApi<BibleChapter>(
    `/bible/eng/${translation}/${bookId}/${chapter}`,
  );

  if ('statusCode' in result) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { chapter: result, translation };
}

export default function Index() {
  const { chapter, translation } = useLoaderData<typeof loader>();

  const chapterText = JSON.parse(chapter.json);

  return (
    <SiPage>
      <div className="flex flex-col space-y-8 pt-6 px-20 min-h-[calc(100vh-80px)]">
        {/* TODO: break bible header out into a component? */}
        <div className="flex w-full items-center justify-between">
          <span className="min-w-28 hover:underline hover:cursor-pointer text-si-main dark:text-si-brown">
            <a
              href={`/bible/${translation}/${chapter.previousBookId}/${chapter.previousChapterNumber}`}
            >
              {chapter.previousBookId
                ? `< ${
                    OsisToBookName[
                      chapter.previousBookId as keyof typeof OsisToBookName
                    ]
                  } ${chapter.previousChapterNumber}`
                : ''}
            </a>
          </span>
          <span className="text-4xl">{`${
            OsisToBookName[chapter.bookId as keyof typeof OsisToBookName]
          } ${chapter.number}`}</span>
          <span className="min-w-28 hover:underline hover:cursor-pointer text-si-main dark:text-si-brown">
            <a
              className="flex items-center"
              href={`/bible/${translation}/${chapter.nextBookId}/${chapter.nextChapterNumber}`}
            >
              {chapter.nextBookId
                ? `${
                    OsisToBookName[
                      chapter.nextBookId as keyof typeof OsisToBookName
                    ]
                  } ${chapter.nextChapterNumber} >`
                : ''}
            </a>
          </span>
        </div>
        <div key="chapter-content" className="">
          <StandardHeader text={chapter.translationName} />
          <div className="pt-4">
            {formatBibleChapter(
              translation as string,
              chapter.bookId as string,
              chapterText,
            )}
          </div>
        </div>
      </div>
    </SiPage>
  );
}
