import { Link } from '@remix-run/react';
import { getSermonType, Sermon } from '~/api/interfaces';
import { formatDownloads } from '~/common/format-downloads';
import { FaVolumeUp, FaVideo } from 'react-icons/fa';
import { hasContent } from '~/common/sanitize';
import { IoDocumentText } from 'react-icons/io5';

function stripQuotes(str: string): string {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  return str;
}

function getMediaIcon(sermon: Sermon) {
  const sermonType = getSermonType(sermon);
  if (sermonType === 'Video') {
    return <FaVideo />;
  } else if (sermonType === 'Audio') {
    return <FaVolumeUp />;
  } else if (sermonType === 'Text') {
    return <IoDocumentText />;
  }
  // todo: other media types might be added like book, quote, short, etc.
  return null;
}

export interface SermonListProps {
  sermons: Sermon[];
  showTopic?: boolean;
  showContributor?: boolean;
}

export const SermonList = ({
  sermons,
  showTopic,
  showContributor,
}: SermonListProps) => {
  return (
    <ul>
      {sermons.map((sermon) => (
        <Link to={`/sermons/${sermon.id}`}>
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
                    <span>Speaker: {sermon.contributorFullName}</span>
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
                        Scriptures: {sermon.bibleReferences.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-end">
                    <span>Downloads: {formatDownloads(sermon.hits)}</span>
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
