import { Link } from '@remix-run/react';
import { Sermon } from '~/api/interfaces';
import { formatDownloads } from '~/common/format-downloads';
import { FaFileAudio, FaFileVideo } from 'react-icons/fa';
import { hasContent } from '~/common/sanitize';

function stripQuotes(str: string): string {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  return str;
}

function getMediaIcon(sermon: Sermon) {
  if (hasContent(sermon.videoUrl)) {
    return <FaFileVideo />;
  } else if (hasContent(sermon.audioUrl)) {
    return <FaFileAudio />;
  }
  // todo: detect if this is a text message, a book, etc.
  return null;
}

export interface SermonListProps {
  sermons: Sermon[];
}

export const SermonList = ({ sermons }: SermonListProps) => {
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
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <div>
                    {sermon.topics.length > 0 && (
                      <span>Topics: {sermon.topics}</span>
                    )}
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
