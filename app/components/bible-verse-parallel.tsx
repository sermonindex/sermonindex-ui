import { BibleChapter, BibleParallel } from '~/api/interfaces';
import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from 'react-icons/fa';
import { OsisToBookName } from '~/common/bible-constants';
import { ChapterData, ChapterContent, ChapterVerse } from '~/api/bible.types';

export interface BibleVerseParallelProps {
  parallels: BibleParallel;
  chapterData: BibleChapter;
  previousChapterData: BibleChapter | null;
}

interface VerseNavigation {
  previousBook: string | null;
  previousChapter: number | null;
  previousVerse: number | null;
  nextBook: string | null;
  nextChapter: number | null;
  nextVerse: number | null;
  isFirstVerseOfGenesis: boolean;
  isLastVerseOfRevalation: boolean;
}

function calculateVerseNavigation(
  book: string,
  chapter: number,
  verse: number,
  chapterData: BibleChapter,
  previousChapterData: BibleChapter | null,
): VerseNavigation {

  let previousBook: string | null = null;
  let previousChapter: number | null = null;
  let previousVerse: number | null = null;
  let nextBook: string | null = null;
  let nextChapter: number | null = null;
  let nextVerse: number | null = null;
  let isFirstVerseOfGenesis: boolean;
  let isLastVerseOfRevalation: boolean;

  isFirstVerseOfGenesis = false;
  isLastVerseOfRevalation = false;

  if (book === 'GEN' && chapter === 1 && verse === 1) {
    isFirstVerseOfGenesis = true;
  }

  if (book === 'REV' && chapter === 22 && verse === 21) {
    isLastVerseOfRevalation = true;
  }

  // Defaults
  previousBook = book;
  previousChapter = chapter;
  nextBook = book;
  nextChapter = chapter;

  if (verse === 1) {
    previousVerse = previousChapterData?.verses.length - 1;
    previousBook = chapterData.previousBookId;
    previousChapter = chapterData.previousChapterNumber;
  } else {
    previousVerse = verse - 1;
  }

  if (verse === chapterData.verses.length - 1) {
    nextVerse = 1;
    nextBook = chapterData.nextBookId;
    nextChapter = chapterData.nextChapterNumber;
  } else {
    nextVerse = verse + 1;
  }

  return {
    previousBook,
    previousChapter,
    previousVerse,
    nextBook,
    nextChapter,
    nextVerse,
    isFirstVerseOfGenesis,
    isLastVerseOfRevalation
  };
}

export const BibleVerseParallel = ({ parallels, chapterData, previousChapterData }: BibleVerseParallelProps) => {
  const contextData = JSON.parse(parallels.contextJson);
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
    <div>
      {/* Browse Links */}
      <div className="flex w-full min-h-16 items-center justify-center space-x-14 md:space-x-24 mb-4">

        {!navigation.isFirstVerseOfGenesis && (
          <Link to={previousUrl} >
            <IconContext.Provider
              value={{
                className:
                  'w-6 h-6 md:w-7 md:h-7 text-neutral-600 dark:text-neutral-200',
              }}
            >
              <FaRegArrowAltCircleLeft />
            </IconContext.Provider>
          </Link>
        )}

        <span className="text-2xl md:text-3xl text-center">{reference}</span>

        {!navigation.isLastVerseOfRevalation && (
          <Link to={nextUrl} >
            <IconContext.Provider
              value={{
                className:
                  'w-6 h-6 md:w-7 md:h-7 text-neutral-600 dark:text-neutral-200',
              }}
            >
              <FaRegArrowAltCircleRight />
            </IconContext.Provider>
          </Link>
        )}

      </div>

      {/* Verse Translations */}
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
  );
};
