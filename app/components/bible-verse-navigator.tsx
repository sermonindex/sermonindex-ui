import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from 'react-icons/fa';
import { OsisToBookName } from '~/common/bible-constants';

export interface VerseNavigatorProps {
  book: string;
  chapter: number;
  verse: number;
  previousUrl: string;
  nextUrl: string;
  showPrevious: boolean;
  showNext: boolean;
}

export function VerseNavigator({
  book,
  chapter,
  verse,
  previousUrl,
  nextUrl,
  showPrevious,
  showNext,
}: VerseNavigatorProps) {
  const iconContextValue = {
    className:
      'w-6 h-6 md:w-7 md:h-7 text-neutral-600 dark:text-neutral-200 hover:text-si-main dark:hover:text-si-brown',
  };

  return (
    <div className="flex w-full min-h-16 items-center justify-center gap-x-8 md:gap-x-12 mb-4">
      {showPrevious ? (
        <Link to={previousUrl} prefetch="intent" title="Previous Verse">
          <IconContext.Provider value={iconContextValue}>
            <FaRegArrowAltCircleLeft />
          </IconContext.Provider>
        </Link>
      ) : (
        // Add a placeholder to maintain balance when one arrow is hidden
        <div className="w-6 md:w-7" />
      )}

      <h1 className="text-2xl md:text-3xl text-center whitespace-nowrap">
        {OsisToBookName[book as keyof typeof OsisToBookName]} {chapter}:{verse}
      </h1>

      {showNext ? (
        <Link to={nextUrl} prefetch="intent" title="Next Verse">
          <IconContext.Provider value={iconContextValue}>
            <FaRegArrowAltCircleRight />
          </IconContext.Provider>
        </Link>
      ) : (
        // Add a placeholder to maintain balance when one arrow is hidden
        <div className="w-6 md:w-7" />
      )}
    </div>
  );
}
