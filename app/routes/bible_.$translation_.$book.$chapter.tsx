import { LoaderFunctionArgs } from '@remix-run/node';
import { json, Link, MetaFunction, useLoaderData } from '@remix-run/react';
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
  MediaType,
  Sermon,
  SermonInfo,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { OsisToBookName } from '~/common/bible-constants';
import { getBibleBookId } from '~/common/get-bible-book-id.fn';
import { getMetaTags } from '~/common/get-meta-tags';
import { formatBibleChapter } from '~/components/bible-chapter';
import { CommentaryChapterData } from '~/components/commentary-chapter';
import { MiniPlayer } from '~/components/media/player';
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
      `/sermons?book=${bookId}&chapter=${chapter}&offset=0&limit=25`,
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
    throw new Response(`Oh no! Something went wrong!`, {
      status: 500,
    });
  }

  return json(
    { chapter: chapterContent, sermons, translation, commentaries },
    {
      headers: { 'Cache-Control': 'public, max-age=86400' },
    },
  );
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const reference = `${
    OsisToBookName[data?.chapter.bookId as keyof typeof OsisToBookName]
  } ${data?.chapter.number} (${data?.translation})`;
  const description = `Read ${reference} and explore sermons and commentary related to this chapter on SermonIndex.`;
  const url = `https://sermonindex.net/bible/${params.translation}/${params.book}/${params.chapter}`;

  return getMetaTags({
    title: reference,
    description,
    url,
  });
};

export default function Index() {
  const { chapter, commentaries, sermons, translation } =
    useLoaderData<typeof loader>();
  const chapterText = JSON.parse(chapter.json);

  const [activeTab, setActiveTab] = useState(Tabs.Scripture);
  const [activeCommentaryTab, setActiveCommentaryTab] = useState(
    commentaries.values[0].id,
  );

  const reference = `${
    OsisToBookName[chapter.bookId as keyof typeof OsisToBookName]
  } ${chapter.number}`;

  return (
    <SiPage>
      <div className="flex flex-col">
        <div className="flex w-full min-h-24 items-center justify-center space-x-14 md:space-x-24">
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
          <span className="text-3xl md:text-4xl">{reference}</span>
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
        {translation === 'BSB' && (
          <div className="flex items-center justify-center">
            <div className="w-full md:w-3/4">
              <MiniPlayer
                sermon={
                  {
                    title: reference,
                    mediaType: MediaType.Audio,
                    audio: { streamUrl: chapter.streamUrl },
                  } as Sermon
                }
              />
            </div>
          </div>
        )}

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
            className="py-4 md:p-4"
          >
            <TabContainer>
              <TabList tabStyle="pill">
                {commentaries.values.map((commentary, index) => (
                  <TabListItem
                    title={commentary.author ?? commentary.name}
                    tabStyle="pill"
                    key={index}
                    active={commentary.id === activeCommentaryTab}
                    onClick={() => setActiveCommentaryTab(commentary.id)}
                  />
                ))}
              </TabList>

              {commentaries.values.map((commentary, index) => (
                <TabContent
                  key={index}
                  active={commentary.id === activeCommentaryTab}
                >
                  <CommentaryChapterData commentary={commentary} />
                </TabContent>
              ))}
            </TabContainer>
          </TabContent>
        </TabContainer>
      </div>
    </SiPage>
  );
}
