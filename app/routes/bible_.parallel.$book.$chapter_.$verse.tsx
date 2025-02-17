import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import React from 'react';
import { ChapterData } from '~/api/bible.types';
import {
  BibleParallel,
  CommentaryVerse,
  ListResponse,
  Sermon,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { OsisToBookName } from '~/common/bible-constants';
import { formatDownloads } from '~/common/format-downloads';
import { getBibleBookId } from '~/common/get-bible-book-id.fn';
import { StandardHeader } from '~/common/section';
import { VerseContext } from '~/components/bible-verse-context';
import SiPage from '~/components/si-page';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

export async function loader({ params }: LoaderFunctionArgs) {
  const { book, chapter, verse } = params;
  const bookId = getBibleBookId(book);

  const [parallels, sermons, commentaries] = await Promise.all([
    // translations=BSB,KJV,ASV,WEB,YLT,BBE,DRV,GNV,T4T,OUR,FBV,PEV,ULB,WBS,LST
    fetchApi<BibleParallel>(
      `/bible/eng/parallel/${bookId}/${chapter}/${verse}?translations=BSB,eng_kjv,eng_asv,eng_webp,eng_ylt,eng_bbe,eng_drv,eng_gnv,eng_t4t,eng_our,eng_fbv,eng_pev,eng_ulb,eng_wbs,eng_lst`,
    ),
    fetchApi<ListResponse<Sermon>>(
      `/sermons?book=${bookId}&chapter=${chapter}&verse=${verse}&take=25`,
    ),
    fetchApi<ListResponse<CommentaryVerse>>(
      `/commentary/eng/parallel/${bookId}/${chapter}/${verse}`,
    ),
  ]);

  if (
    'statusCode' in parallels ||
    'statusCode' in sermons ||
    'statusCode' in commentaries
  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { parallels, sermons, commentaries };
}

export default function Index() {
  const { parallels, sermons, commentaries } = useLoaderData<typeof loader>();
  const verseContext = JSON.parse(parallels.contextJson) as ChapterData;

  const [activeTab, setActiveTab] = React.useState(
    commentaries.values[0].commentaryId,
  );

  return (
    <SiPage>
      <div className="flex flex-col space-y-8 pt-6 px-8 min-h-[calc(100vh-80px)]">
        <div className="flex w-full items-center justify-between">
          {/* TODO: NEED TO RETURN NEXT AND PREVIOUS VERSES FROM THE API */}
          <span></span>
          {/* <span className="text-si-brown hover:underline hover:cursor-pointer">
            Genesis 1:1 {'>'}
          </span> */}
          <span className="text-4xl">
            {OsisToBookName[parallels.book as keyof typeof OsisToBookName]}{' '}
            {parallels.chapter}:{parallels.verse}
          </span>
          <span></span>
          {/* <span className="text-si-brown hover:underline hover:cursor-pointer">
            Genesis 1:3 {'>'}
          </span> */}
        </div>
        <div className="grid grid-cols-3 space-x-4">
          <div className="col-span-2">
            <StandardHeader text="Verse" />
            {parallels.verses.map((verse, index) => {
              return (
                <div key={index} className="py-1 px-2">
                  {/* TODO: LINK TRANSLATION NAME TO CHAPTER PAGE */}
                  <Link
                    to={`/bible/${verse.translationId}/${parallels.book}/${parallels.chapter}`}
                  >
                    <span className="text-si-main dark:text-si-brown hover:underline hover:cursor-pointer">
                      {verse.translationName}
                    </span>
                  </Link>
                  <div>{verse.text}</div>
                </div>
              );
            })}
          </div>
          <div>
            <StandardHeader text="Context" />
            <div className="py-4 px-2">
              <VerseContext context={verseContext} book={parallels.book} />
            </div>
            <StandardHeader text="Sermons" />
            <div>
              {sermons.values.slice(0, 10).map((sermon, index) => {
                return (
                  <div key={index} className="flex  justify-between py-1 px-2">
                    <div className="flex flex-col ">
                      <Link
                        to={`/sermons/${sermon.id}`}
                        className="text-si-main dark:text-si-brown hover:underline hover:cursor-pointer"
                      >
                        {sermon.title}
                      </Link>
                      <span className="pl-2">
                        by {sermon.contributorFullName}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400 pl-2">
                      {formatDownloads(sermon.hits)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <StandardHeader text={'Commentaries'} />
          <TabContainer>
            <TabList>
              {commentaries.values.map((commentary, index) => (
                <TabListItem
                  title={
                    commentary.commentaryAuthor ?? commentary.commentaryName
                  }
                  key={index}
                  active={commentary.commentaryId === activeTab}
                  onClick={() => setActiveTab(commentary.commentaryId)}
                />
              ))}
            </TabList>

            {commentaries.values.map((commentary, index) => (
              <TabContent
                key={index}
                active={commentary.commentaryId === activeTab}
              >
                <h1 className="px-2 pt-2 font-semibold">
                  {commentary.commentaryName}
                </h1>
                <p className="px-6 pt-2 whitespace-pre-line">
                  {commentary.text}
                </p>
              </TabContent>
            ))}
          </TabContainer>
        </div>
      </div>
    </SiPage>
  );
}
