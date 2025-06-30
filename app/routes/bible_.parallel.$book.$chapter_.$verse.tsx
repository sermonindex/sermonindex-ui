import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ChapterData } from '~/api/bible.types';
import {
  BibleParallel,
  CommentaryVerse,
  ListPaginatedResponse,
  ListResponse,
  SermonInfo,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { getBibleBookId } from '~/common/get-bible-book-id.fn';
import { VerseContext } from '~/components/bible-verse-context';
import { SermonList } from '~/components/sermon-list';
import { SiPage } from '~/components/si-page';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

import React from 'react';
import { SiSection } from '~/components/section';
import { CommentaryByVerseTabbed } from '~/components/commentary-verse';
import { BibleVerseParallel } from '~/components/bible-verse-parallel';
import { OsisToBookName } from '~/common/bible-constants';
import { AuthorImage } from '~/components/image-author';
import { formatNumber } from '~/common/format-number';

enum Tabs {
  Scripture = 'Scripture',
  // Summary = 'Summary',
  Sermons = 'Sermons',
  Commentary = 'Commentary',
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { book, chapter, verse } = params;
  const bookId = getBibleBookId(book);

  const [parallels, sermons, commentaries] = await Promise.all([
    // translations=BSB,KJV,ASV,WEB,YLT,BBE,DRV,GNV,T4T,OUR,FBV,PEV,ULB,WBS,LST
    fetchApi<BibleParallel>(
      `/bible/eng/parallel/${bookId}/${chapter}/${verse}?translations=BSB,eng_kjv,eng_asv,eng_webp,eng_ylt,eng_bbe,eng_drv,eng_gnv,eng_t4t,eng_our,eng_fbv,eng_pev,eng_ulb,eng_wbs,eng_lst`,
    ),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons?book=${bookId}&chapter=${chapter}&verse=${verse}&offset=0&limit=25`,
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

  const [activeTab, setActiveTab] = useState(Tabs.Scripture);

  return (
    <SiPage>
      {/* Desktop View */}
      <div className="w-full hidden lg:block pb-8">
        <h1 className="flex w-full text-2xl md:text-3xl items-center justify-center">
          {OsisToBookName[parallels.book as keyof typeof OsisToBookName]}{' '}
          {parallels.chapter}:{parallels.verse}
        </h1>

        <div className="grid grid-cols-3">
          <div className="col-span-2">
            <SiSection title="Verse">
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
            </SiSection>
          </div>
          <div>
            <SiSection title="Context">
              <VerseContext
                context={verseContext}
                book={parallels.book}
                chapter={parallels.chapter}
                verse={parallels.verse}
                slim={true}
              />
            </SiSection>
            {sermons.values.length > 0 && (
              <SiSection title="Sermons">
                {sermons.values.slice(0, 7).map((sermon, index) => {
                  return (
                    <div
                      key={index}
                      className="flex  justify-between py-1 px-2"
                    >
                      <div className="flex flex-col ">
                        <Link
                          to={`/sermons/${sermon.id}`}
                          className="text-si-main dark:text-si-brown hover:underline hover:cursor-pointer"
                        >
                          {sermon.title}
                        </Link>
                        <div className="pl-2 text-sm text-si-slate/80 dark:text-si-dim/80">
                          <AuthorImage
                            author={sermon.contributorFullName}
                            imageUrl={sermon.contributorImageUrl}
                          />
                        </div>
                      </div>
                      <span className="pl-2 text-sm text-si-slate/80 dark:text-si-dim/80">
                        {formatNumber(sermon.views)}
                      </span>
                    </div>
                  );
                })}
              </SiSection>
            )}
          </div>
        </div>
        <SiSection title="Commentary">
          <CommentaryByVerseTabbed commentaries={commentaries} />
        </SiSection>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden block">
        <VerseContext
          context={verseContext}
          book={parallels.book}
          chapter={parallels.chapter}
          verse={parallels.verse}
        />

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
            <BibleVerseParallel parallels={parallels} />
          </TabContent>

          {/* <TabContent
            key={Tabs.Summary}
            active={activeTab === Tabs.Summary}
            className="py-4 px-2 md:p-6"
          >
            <p>{parallels.summary}</p>
          </TabContent> */}

          <TabContent
            key={Tabs.Sermons}
            active={activeTab === Tabs.Sermons}
            className="px-1 md:px-4 py-2"
          >
            <SermonList
              sermons={sermons.values}
              filters={{
                book: parallels.book,
                chapter: parallels.chapter,
                verse: parallels.verse,
              }}
              nextPage={sermons.nextPage}
              showContributor={true}
            />
          </TabContent>

          <TabContent
            key={Tabs.Commentary}
            active={activeTab === Tabs.Commentary}
            className="pt-2"
          >
            <CommentaryByVerseTabbed commentaries={commentaries} />
          </TabContent>
        </TabContainer>
      </div>
    </SiPage>
  );
}
