import { BibleParallel } from '~/api/interfaces';
import { Link } from '@remix-run/react';
import React from 'react';

export interface BibleVerseParallelProps {
  parallels: BibleParallel;
}

export const BibleVerseParallel = ({ parallels }: BibleVerseParallelProps) => {
  return (
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
  );
};
