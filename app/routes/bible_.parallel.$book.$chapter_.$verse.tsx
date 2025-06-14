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
import { linkifyScripture } from '~/components/linkify-scripture';

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
      `/sermons?book=${bookId}&chapter=${chapter}&verse=${verse}&offset=0&limit=50`,
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
  const [activeCommentaryTab, setActiveCommentaryTab] = useState(
    commentaries.values[0].id,
  );

  return (
    <SiPage>
      <div>
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
            <div>
              {parallels.verses.map((verse, index) => {
                return (
                  <div key={index} className="py-1 px-2">
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
                  <h1 className="px-2 pt-2 font-semibold">{commentary.name}</h1>
                  <p className="px-2 pt-2 whitespace-pre-line">
                    <p className="whitespace-pre-line">
                      {linkifyScripture(commentary.text).map((part, index) => (
                        <React.Fragment key={index}>{part}</React.Fragment>
                      ))}
                    </p>
                  </p>
                </TabContent>
              ))}
            </TabContainer>
          </TabContent>
        </TabContainer>
      </div>
    </SiPage>
  );
}
