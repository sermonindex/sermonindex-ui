import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { IconContext } from 'react-icons';
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from 'react-icons/fa';
import {
  BibleChapter,
  ListPaginatedResponse,
  ListResponse,
  SermonInfo,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { OsisToBookName } from '~/common/bible-constants';
import { getBibleBookId } from '~/common/get-bible-book-id.fn';
import { formatBibleChapter } from '~/components/bible-chapter';
import { SermonList } from '~/components/sermon-list';
import { SiPage } from '~/components/si-page';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

enum Tabs {
  Scripture = 'Scripture',
  // Summary = 'Summary',
  Sermons = 'Sermons',
  Commentary = 'Commentary',
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { translation, book, chapter } = params;
  const bookId = getBibleBookId(book);

  const [chapterContent, sermons, commentaries] = await Promise.all([
    fetchApi<BibleChapter>(`/bible/eng/${translation}/${bookId}/${chapter}`),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons?book=${bookId}&chapter=${chapter}&offset=0&limit=50`,
    ),
    // TODO: Add a CommentaryChapter type
    fetchApi<ListResponse<any>>(
      `/commentary/eng/parallel/${bookId}/${chapter}`,
    ),
  ]);

  if (
    'statusCode' in chapterContent ||
    'statusCode' in sermons ||
    'statusCode' in commentaries
  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { chapter: chapterContent, sermons, translation };
}

export default function Index() {
  const { chapter, sermons, translation } = useLoaderData<typeof loader>();
  const chapterText = JSON.parse(chapter.json);

  const [activeTab, setActiveTab] = useState(Tabs.Scripture);

  return (
    <SiPage>
      <div className="flex flex-col">
        <div className="flex w-full min-h-28 items-center justify-center space-x-14 md:space-x-24">
          <Link
            to={`/bible/${translation}/${chapter.previousBookId}/${chapter.previousChapterNumber}`}
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
          <span className="text-3xl md:text-4xl">{`${
            OsisToBookName[chapter.bookId as keyof typeof OsisToBookName]
          } ${chapter.number}`}</span>
          <span className="hover:underline hover:cursor-pointer">
            <Link
              to={`/bible/${translation}/${chapter.nextBookId}/${chapter.nextChapterNumber}`}
            >
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

        <TabContainer>
          <TabList>
            {Object.values(Tabs).map((tab, index) => (
              <TabListItem
                title={tab}
                key={index}
                active={tab === activeTab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </TabList>

          <TabContent
            key={Tabs.Scripture}
            active={activeTab === Tabs.Scripture}
            className="py-4 px-2 md:p-4"
          >
            {formatBibleChapter(
              translation as string,
              chapter.bookId as string,
              chapterText,
            )}
          </TabContent>

          {/* <TabContent
            key={Tabs.Summary}
            active={activeTab === Tabs.Summary}
            className="py-4 px-2 md:p-6"
          >
            <p>Todo</p>
          </TabContent> */}

          <TabContent
            key={Tabs.Sermons}
            active={activeTab === Tabs.Sermons}
            className="px-1 md:px-4 py-2"
          >
            <SermonList
              sermons={sermons.values}
              filters={{
                book: chapter.bookId,
                chapter: chapter.number,
              }}
              nextPage={sermons.nextPage}
              showContributor={true}
            />
          </TabContent>

          <TabContent
            key={Tabs.Commentary}
            active={activeTab === Tabs.Commentary}
            className="py-4 px-2 md:p-6"
          >
            <p>#Todo</p>
          </TabContent>
        </TabContainer>
      </div>
    </SiPage>
  );
}
