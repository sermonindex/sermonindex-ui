import { Link } from '@remix-run/react';
import { FaVideo, FaVolumeUp } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { MediaType, SermonInfo } from '~/api/interfaces';
import { formatNumber } from '~/common/format-number';
import { hasContent } from '~/common/sanitize';
import React from 'react';
import { AuthorImage } from '~/components/image-author';

function stripQuotes(str: string): string {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  return str;
}

function getMediaIcon(sermon: SermonInfo) {
  if (sermon.mediaType === MediaType.Video) {
    return <FaVideo />;
  } else if (sermon.mediaType === MediaType.Audio) {
    return <FaVolumeUp />;
  } else if (sermon.mediaType === MediaType.Text) {
    return <IoDocumentText />;
  }
  // todo: other media types might be added like book, quote, short, etc.
  return null;
}

export interface SermonListProps {
  sermons: SermonInfo[];
  showTopic?: boolean;
  showContributor?: boolean;
}

export const SermonList = ({
  sermons,
  showTopic,
  showContributor,
}: SermonListProps) => {
  if (sermons.length === 0) {
    return <div>No sermons found</div>;
  }

  return (
    <ul>
      {sermons.map((sermon) => (
        <Link to={`/sermons/${sermon.id}`} key={sermon.id}>
          <li
            className="flex flex-col p-2 border-b-2 group hover:cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
            key={sermon.id}
          >
            <span className="flex flex-row text-lg font-bold group-hover:underline justify-between">
              {stripQuotes(sermon.title)}
              <div className="items-center text-md pl-3 justify-end">
                {getMediaIcon(sermon)}
              </div>
            </span>
            <div className="pl-2 font-light">
              <div className="pt-1 flex flex-col">
                {showContributor && (
                  <div className="pb-2">
                    <AuthorImage
                      author={sermon.contributorFullName}
                      imageUrl={sermon.contributorImageUrl}
                    />
                  </div>
                )}
                {sermon.topics.length > 0 && showTopic && (
                  <div className="pb-2">
                    <span>Topics: {sermon.topics}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <div>
                    {sermon.bibleReferences.length > 0 && (
                      <div className="flex justify-center">
                        Scriptures:{' '}
                        {sermon.bibleReferences
                          .map((reference) => reference.text)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-end pl-2">
                    <span>Downloads: {formatNumber(sermon.hits)}</span>
                  </div>
                </div>
              </div>
              {hasContent(sermon.description) && (
                <div className="flex pt-2 space-x-2">
                  <span className="flex-none">Description: </span>
                  <span>{sermon.description}</span>
                </div>
              )}
            </div>
          </li>
        </Link>
      ))}
    </ul>
  );
};
