import { Link } from '@remix-run/react';
import { Sermon } from '~/api/interfaces';
import { formatDownloads } from '~/common/format-downloads';

export interface SermonListProps {
  sermons: Sermon[];
}

export const SermonList = ({ sermons }: SermonListProps) => {
  return (
    <ul>
      {sermons.map((sermon) => (
        <Link to={`/sermons/${sermon.id}`}>
          <li
            // className="group flex flex-col text-slate-700 hover:cursor-pointer hover:underline hover:bg-gray-300"
            className="flex flex-col p-2 border-b-2 group hover:cursor-pointer hover:bg-gray-300"
            key={sermon.id}
          >
            <span className="text-lg font-bold group-hover:underline">
              {sermon.title}
            </span>
            <div className="pl-2 font-light">
              <span className="grid grid-cols-3">
                <span>Topics: {sermon.topics}</span>
                <span className="text-center">
                  Scriptures: {sermon.bibleReferences}
                </span>
                <span className="text-right">
                  Downloads: {formatDownloads(sermon.hits)}
                </span>
              </span>
              <div className="flex pt-2 space-x-2">
                <span className="flex-none">Description: </span>
                <span>{sermon.description}</span>
              </div>
            </div>
          </li>
        </Link>
      ))}
    </ul>
  );
};
