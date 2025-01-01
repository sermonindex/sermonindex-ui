import {
  ChapterData,
  ChapterHeading,
  ChapterVerse,
  FormattedText,
} from '~/api/bible.types';
import { constructVerseReference } from './bible-chapter';

export interface VerseContextProps {
  book: string;
  context: ChapterData;
}

export const VerseContext = ({ book, context: data }: VerseContextProps) => {
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
        data.number,
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
        // TODO: Highlight verse if it is the current verse
        <span key={`verse-${data.number}-${verse.number}`}>
          {verseText.join(' ')}
        </span>,
      );
    }
  }

  return (
    <>
      <p id="context-heading" className="font-bold mb-1">
        {heading}
      </p>
      <p id="context-verses" className="px-2">
        {versesContent}
      </p>
    </>
  );
};
