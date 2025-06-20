import React from 'react';
import { ChapterVerse } from '~/api/bible.types';
import { CommentaryChapter } from '~/api/interfaces';
import { linkifyScripture } from './linkify-scripture';

interface CommentaryChapterProps {
  commentary: CommentaryChapter;
}

export const CommentaryChapterData = ({
  commentary,
}: CommentaryChapterProps) => {
  const content = JSON.parse(commentary.contentJson).content as ChapterVerse[];

  return (
    <div className="px-2 pt-2">
      {commentary.introduction && (
        <>
          <h2 className="pt-2 font-semibold">Introduction</h2>
          <p className="pt-1">
            {linkifyScripture(commentary.introduction).map((part, index) => (
              <React.Fragment key={index}>{part}</React.Fragment>
            ))}
          </p>
        </>
      )}

      {content.map((verse, index) => (
        <div key={index}>
          <h2 className="pt-4 font-semibold">Verse {verse.number}</h2>
          {verse.content.map((line, lineIndex) => (
            <p key={lineIndex} className="pt-1">
              {linkifyScripture(line as string).map((part, partIndex) => (
                <React.Fragment key={partIndex}>{part}</React.Fragment>
              ))}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};
