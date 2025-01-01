import React from 'react';
import {
  ChapterData,
  ChapterFootnote,
  ChapterHeading,
  ChapterHebrewSubtitle,
  ChapterVerse,
  FormattedText,
  InlineHeading,
  InlineLineBreak,
  VerseFootnoteReference,
} from '~/api/bible.types';
import { BookNameToOsis } from '../common/bible-constants';
import { classNames } from '../common/classnames.fn';

export function isPoemOnNewLine(
  content: ChapterVerse['content'],
  index: number,
) {
  const line = content[index];

  for (let i = index - 1; i >= 0; i--) {
    if ((content[i] as InlineLineBreak).lineBreak) {
      return true;
    }
    if ((content[i] as FormattedText).poem) {
      return (content[i] as FormattedText).poem != (line as FormattedText).poem;
    }
  }

  return true;
}

export function skipLineBreak(content: ChapterVerse['content'], index: number) {
  // We skip line breaks if:
  // * the previous line and next line are poems with the same indent and are greater than 1

  const lastPoemLine = content
    .slice(0, index)
    .reverse()
    .find((item) => (item as FormattedText).poem) as FormattedText;
  const nextPoemLine = content
    .slice(index)
    .find((item) => (item as FormattedText).poem) as FormattedText;

  if (lastPoemLine && nextPoemLine && lastPoemLine.poem === nextPoemLine.poem) {
    return true;
  }

  return false;
}

export function constructVerseReference(
  book: string,
  chapter: number,
  verse: number,
) {
  return (
    <sup key={'random'} className="pr-[2px]">
      <a
        href={`/bible/parallel/${book}/${chapter}/${verse}`}
        className="text-si-main dark:text-si-brown hover:opacity-50 hover:underline hover:cursor-pointer"
      >
        {verse}
      </a>
    </sup>
  );
}

export function constructFootnoteReference(caller: string) {
  return (
    <sup>
      <a
        href={`#footnotes`}
        className="italic text-si-main dark:text-si-brown hover:opacity-50 hover:underline hover:cursor-pointer"
      >
        {caller}
      </a>
    </sup>
  );
}

export function doesChapterContainLineBreaks(data: ChapterData) {
  for (let i = 0; i < data.content.length; i++) {
    if (data.content[i].type === 'line_break') {
      return true;
    }

    if (data.content[i].type === 'verse') {
      const verse = data.content[i] as ChapterVerse;

      for (let j = 0; j < verse.content.length; j++) {
        if ((verse.content[j] as InlineLineBreak).lineBreak) {
          if (!skipLineBreak(verse.content, j)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

export function doesChapterContainOnlyPoetry(data: ChapterData) {
  for (let i = 0; i < data.content.length; i++) {
    if (data.content[i].type === 'verse') {
      const verse = data.content[i] as ChapterVerse;

      let verseContainsPoem = false;
      for (let j = 0; j < verse.content.length; j++) {
        if ((verse.content[j] as FormattedText).poem) {
          verseContainsPoem = true;
          break;
        }
      }

      if (!verseContainsPoem) {
        return false;
      }
    }
  }

  return true;
}

export function addContentToChapter(
  content: React.ReactNode[],
  addition: React.ReactElement,
  createParagraph?: boolean,
  paragraphStyles?: string,
  insertSpace: boolean = true,
): React.ReactNode[] {
  const styles = paragraphStyles ? paragraphStyles : 'my-4';

  if (createParagraph) {
    content.push(
      <p key={content.length} className={styles}>
        {addition}
      </p>,
    );

    return content;
  }

  let last = content.pop() as React.ReactElement;
  if (last) {
    const latest = React.cloneElement(last, {
      children: (
        <>
          {last.props.children}
          {insertSpace ? ' ' : ''}
          {addition}
        </>
      ),
    });
    content.push(latest);
  } else {
    content.push(
      <p key={content.length} className={styles}>
        {addition}
      </p>,
    );
  }

  return content;
}

export function addFootnotesToChapterContent(
  content: React.ReactNode[],
  footnotes: ChapterFootnote[],
  footnotesMap: Map<number, string>,
) {
  if (footnotes.length > 0) {
    // Separate the chapter content from the footnotes
    content.push(<div className="border-t border-gray-300 my-8 mx-6"></div>);

    content.push(
      <p key={'footnotes'} id={`footnotes`} className="font-bold my-4">
        Footnotes:
      </p>,
    );

    for (let footnote of footnotes) {
      const verse =
        footnote.reference?.verse === 0 ? 1 : footnote.reference?.verse;

      // TODO: This would look nicer as a table
      content.push(
        <p key={footnote.noteId} id={`footnote-${footnote.noteId}`}>
          <sup className="text-si-accent">{verse}</sup>{' '}
          <sup className="text-si-main dark:text-si-brown">
            {footnotesMap.get(footnote.noteId)}
          </sup>
          {footnote.text}
        </p>,
      );
    }
  }

  return content;
}

// TODO: Convert this to a React component
export function formatBibleChapter(
  translation: string,
  book: string,
  data: ChapterData,
) {
  let result: React.ReactNode[] = [];
  let footnotes: Map<number, string> = new Map();
  let newParagraph = true;

  // Check if the chapter contains any linebreaks or poetic structures
  const hasLineBreaks = doesChapterContainLineBreaks(data);
  const hasOnlyPoetry = doesChapterContainOnlyPoetry(data);

  for (let i = 0; i < data.content.length; i++) {
    if (data.content[i].type === 'heading') {
      const heading = (data.content[i] as ChapterHeading).content.join(' ');
      const slug = heading.toLowerCase().replace(/ /g, '-');

      result.push(
        <p key={result.length} id={slug} className="font-bold mt-4">
          {heading}
        </p>,
      );

      newParagraph = true;
      continue;
    }

    if (data.content[i].type === 'hebrew_subtitle') {
      // TODO: Italicize hebrew subtitle
      const heading = data.content[i] as ChapterHebrewSubtitle;
      let items: React.ReactNode[] = [];

      for (let j = 0; j < heading.content.length; j++) {
        const item = heading.content[j];

        if (typeof item === 'string') {
          items.push(item);
        }

        if ((item as FormattedText).poem) {
          throw new Error(
            'FormattedText not implemented for Hebrew Subtitle. But now we know it exists!',
          );
        }

        if ((item as FormattedText).text) {
          items.push((item as FormattedText).text);
        }

        if ((item as VerseFootnoteReference).noteId) {
          const id = (item as VerseFootnoteReference).noteId;
          const index = data.footnotes.findIndex((note) => note.noteId === id);
          const footnote = data.footnotes[index];

          // See bible.types.ts for more information on caller
          let caller =
            footnote.caller === '+'
              ? String.fromCharCode(97 + index)
              : footnote.caller;
          if (!caller) continue;

          const footnoteReference = constructFootnoteReference(caller);
          items.push(footnoteReference);

          // Link the caller to the footnote
          footnotes.set(id, caller);
        }
      }

      result.push(
        <p key={result.length} className="my-2 italic">
          {items}
        </p>,
      );
    }

    if (data.content[i].type === 'line_break') {
      newParagraph = true;
      continue;
    }

    if (data.content[i].type === 'verse') {
      const verse = data.content[i] as ChapterVerse;

      let reference = constructVerseReference(book, data.number, verse.number);
      let isReferenceAdded = false;

      // Loop through the verse content
      for (let j = 0; j < verse.content.length; j++) {
        const item = verse.content[j];
        reference = !isReferenceAdded ? reference : <></>;

        if (typeof item === 'string') {
          result = addContentToChapter(
            result,
            <>
              {reference}
              {item}
            </>,
            newParagraph,
            undefined,
            item.length != 1,
          );

          newParagraph = false;
          isReferenceAdded = true;
          continue;
        }

        if ((item as InlineLineBreak).lineBreak) {
          if (!skipLineBreak(verse.content, j)) {
            newParagraph = true;
          }

          continue;
        }

        if ((item as FormattedText).poem) {
          // TODO: Words of Jesus in Red (wrap text in span)
          const formatted = item as FormattedText;
          const newLine = isPoemOnNewLine(verse.content, j);
          const styles = classNames(
            book != BookNameToOsis.Psalms ? 'pl-8' : '',
            `indent-${4 * (formatted.poem ?? 1)}`,
            newParagraph && j != 1 ? 'mt-4' : '',
          );

          result = addContentToChapter(
            result,
            <>
              {reference}
              {formatted.text}
            </>,
            newLine,
            styles,
            formatted.text.length != 1,
          );

          newParagraph = false;
          isReferenceAdded = true;
          continue;
        }

        if ((item as FormattedText).text) {
          // TODO:  Words of Jesus in Red (wrap text in span)
          const formatted = item as FormattedText;

          result = addContentToChapter(
            result,
            <>
              {reference}
              {formatted.text}
            </>,
            newParagraph,
          );

          newParagraph = false;
          isReferenceAdded = true;
          continue;
        }

        if ((item as VerseFootnoteReference).noteId) {
          const id = (item as VerseFootnoteReference).noteId;
          const index = data.footnotes.findIndex((note) => note.noteId === id);
          const footnote = data.footnotes[index];

          // See bible.types.ts for more information on caller
          let caller =
            footnote.caller === '+'
              ? String.fromCharCode(97 + index)
              : footnote.caller;
          if (!caller) continue;

          const footnoteReference = constructFootnoteReference(caller);
          result = addContentToChapter(
            result,
            footnoteReference,
            undefined,
            undefined,
            false,
          );

          // Link the caller to the footnote
          footnotes.set(id, caller);
        }

        if ((item as InlineHeading).heading) {
          throw new Error(
            'InlineHeading not implemented. But now we know it exists!',
          );
        }
      }
    }

    // If the chapter has no line breaks, put every verse on a new line
    if (!hasLineBreaks && !hasOnlyPoetry) {
      newParagraph = true;
    }
  }

  // Add footnotes to the chapter content
  result = addFootnotesToChapterContent(result, data.footnotes, footnotes);

  // TODO: Add copyright information?

  return result;
}
