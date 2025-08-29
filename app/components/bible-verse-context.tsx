import {
  ChapterData,
  ChapterHeading,
  ChapterVerse,
  FormattedText,
} from '~/api/bible.types';
import { OsisToBookName } from '~/common/bible-constants';
import { constructVerseReference } from './bible-chapter';
import React from 'react';

export interface VerseContextProps {
  book: string;
  chapter: number;
  verse: number;
  context: ChapterData;
  slim?: boolean;
}

export const VerseContext = ({
  book,
  chapter: chapterNumber,
  verse: verseNumber,
  context: data,
  slim = false,
}: VerseContextProps) => {
  const headingContent = data.content.find(
    (item) => item.type === 'heading',
  ) as ChapterHeading;
  const heading = headingContent.content.join(' ');
  const versesContent: React.ReactNode[] = [];

  for (let i = 0; i < data.content.length; i++) {
    if (data.content[i].type === 'verse') {
      const verse = data.content[i] as ChapterVerse;

      const reference = constructVerseReference(
        book,
        chapterNumber,
        verse.number,
      );
      if (verse.content.length > 1) versesContent.push(' ');

      let verseText: string[] = [];
      for (let j = 0; j < verse.content.length; j++) {
        const item = verse.content[j];

        if (typeof item === 'string') {
          verseText.push(item);
          continue;
        }

        if ((item as FormattedText).text) {
          const formatted = item as FormattedText;
          verseText.push(formatted.text);
          continue;
        }
      }

      versesContent.push(
        reference,
        <span
          key={`verse-${chapterNumber}-${verse.number}`}
          className={`${verse.number === verseNumber ? 'font-semibold' : ''}`}
        >
          {verseText.join(' ')}
        </span>,
      );
    }
  }

  const outerPadding = slim ? '' : 'p-4 md:p-8';

  return (
    <div className={outerPadding}>
      <h2
        id="context-heading"
        className="mb-1 text-neutral-500 dark:text-neutral-400"
      >
        {heading}
      </h2>
      <p id="context-verses" className="">
        {versesContent}
      </p>
    </div>
  );
};
