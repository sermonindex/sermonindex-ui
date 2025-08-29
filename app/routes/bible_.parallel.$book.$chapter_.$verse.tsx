import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, MetaFunction, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ChapterData } from '~/api/bible.types';
import {
  BibleChapter,
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

import { OsisToBookName } from '~/common/bible-constants';
import { formatNumber } from '~/common/format-number';
import { getMetaTags } from '~/common/get-meta-tags';
import { BibleVerseParallel } from '~/components/bible-verse-parallel';
import { CommentaryByVerseTabbed } from '~/components/commentary-verse';
import { AuthorImage } from '~/components/image-author';
import { SiSection } from '~/components/section';
import {calculateVerseNavigation} from "~/common/verse-navigation";
import {VerseNavigator} from "~/components/bible-verse-navigator";

enum Tabs {
  Scripture = 'Scripture',
  // Summary = 'Summary',
  Sermons = 'Sermons',
  Commentary = 'Commentary',
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { book, chapter, verse } = params;
  const bookId = getBibleBookId(book);

  // Prepare API calls for navigation data
  const apiCalls = [
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
    // Hardcoded BSB for now. Would be good to include this in parallel contextJson
    fetchApi<BibleChapter>(
      `/bible/eng/BSB/${bookId}/${chapter}`
    ),
  ];

  const [parallels, sermons, commentaries, chapterData] = await Promise.all(apiCalls);

  if (
    'statusCode' in parallels ||
    'statusCode' in sermons ||
    'statusCode' in commentaries ||
    'statusCode' in chapterData

  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  // Add previous chapter API call if it exists
  let previousChapterDataPromise = null;
  if (chapterData.previousBookId && chapterData.previousChapterNumber) {
    previousChapterDataPromise = fetchApi<BibleChapter>(`/bible/eng/BSB/${chapterData.previousBookId}/${chapterData.previousChapterNumber}`);
  }

  // Fetch previous and next chapter data if needed
  let previousChapterData = null;

  if (previousChapterDataPromise) {
    previousChapterData = await previousChapterDataPromise;
    if ('statusCode' in previousChapterData) {
      previousChapterData = null; // Handle gracefully
    }
  }

  return { parallels, sermons, commentaries, chapterData, previousChapterData };
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const reference = `${OsisToBookName[data?.parallels.book as keyof typeof OsisToBookName]
    } ${data?.parallels.chapter}:${data?.parallels.verse}`;
  const verse =
    data?.parallels.verses.find((v) => v.translationId === 'BSB')?.text || '';

  const description = `${reference} - ${verse}`;
  const url = `https://sermonindex.net/bible/parallel/${params.book}/${params.chapter}/${params.verse}`;

  return getMetaTags({
    title: reference,
    description,
    url,
  });
};

export default function Index() {
  const { parallels, sermons, commentaries, chapterData, previousChapterData } = useLoaderData<typeof loader>();
  const verseContext = JSON.parse(parallels.contextJson) as ChapterData;

  const [activeTab, setActiveTab] = useState(Tabs.Scripture);
  const uniqueVerseKey = `${parallels.book}-${parallels.chapter}-${parallels.verse}`;

  const navigation = calculateVerseNavigation(
      parallels.book,
      parallels.chapter,
      parallels.verse,
      chapterData,
      previousChapterData,
  );

  const reference = `${OsisToBookName[parallels.book as keyof typeof OsisToBookName]
  } ${parallels.chapter}:${parallels.verse}`;

  // Build previous verse URL
  const previousUrl = navigation.previousBook && navigation.previousChapter && navigation.previousVerse
      ? `/bible/parallel/${navigation.previousBook}/${navigation.previousChapter}/${navigation.previousVerse}`
      : '#';

  // Build next verse URL
  const nextUrl = navigation.nextBook && navigation.nextChapter && navigation.nextVerse
      ? `/bible/parallel/${navigation.nextBook}/${navigation.nextChapter}/${navigation.nextVerse}`
      : '#';

  return (
    <SiPage>
      {/* Desktop View */}
      <div className="w-full hidden lg:block pb-8">

        <VerseNavigator
            book={parallels.book}
            chapter={parallels.chapter}
            verse={parallels.verse}
            previousUrl={previousUrl}
            nextUrl={nextUrl}
            showPrevious={!navigation.isFirstVerseOfGenesis}
            showNext={!navigation.isLastVerseOfRevelation}
        />

        <div className="grid grid-cols-3">
          <div className="col-span-2">
            <SiSection title="Verse">
              <BibleVerseParallel parallels={parallels} />
            </SiSection>
          </div>
          <div>
            <SiSection title="Context">
              <VerseContext
                key={uniqueVerseKey}
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
        <SiSection title="Summary">{parallels.summary}</SiSection>
        <SiSection title="Commentary">
          <CommentaryByVerseTabbed commentaries={commentaries} />
        </SiSection>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden block">
        <VerseNavigator
            book={parallels.book}
            chapter={parallels.chapter}
            verse={parallels.verse}
            previousUrl={previousUrl}
            nextUrl={nextUrl}
            showPrevious={!navigation.isFirstVerseOfGenesis}
            showNext={!navigation.isLastVerseOfRevelation}
        />

        <VerseContext
          key={uniqueVerseKey}
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
