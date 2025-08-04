import { Sermon } from '~/api/interfaces';
import { hasContent } from '~/common/sanitize';
import { formatNumber } from '~/common/format-number';
import { formatDuration } from '~/common/format-duration.fn';
import { FiDownload } from 'react-icons/fi';

interface SermonPlaylistProps {
  sermons: Sermon[];
  currentIndex: number;
  onPlaylistItemClick: (index: number) => void;
}

export const SermonPlaylist = ({
  sermons,
  currentIndex,
  onPlaylistItemClick,
}: SermonPlaylistProps) => {
  return (
    <div className="p-2 bg-si-light/80 dark:bg-black/30 -mt-2">
      <ul className="space-y-1">
        {sermons.map((sermon, index) => {
          const isCurrentItem = index === currentIndex;

          return (
            <li
              key={sermon.id}
              onClick={() => onPlaylistItemClick(index)}
              className={`flex items-center p-2 rounded-md transition-all duration-200 border-l-4 ${
                isCurrentItem
                  ? 'bg-si-main/10 dark:bg-si-main/20 border-si-accent' // Active item style
                  : 'border-transparent hover:bg-si-gray/60 dark:hover:bg-si-rock/80 cursor-pointer' // Inactive item style
              }`}
              // Add aria-current for better accessibility on the active item
              aria-current={isCurrentItem ? 'true' : 'false'}
            >
              {hasContent(sermon.thumbnailUrl) && (
                <img
                  src={sermon.thumbnailUrl}
                  alt={sermon.title ?? 'Sermon thumbnail'}
                  className="w-20 h-12 object-cover rounded-md mr-4 bg-gray-200 dark:bg-gray-700"
                  // Add fallback for broken image links
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                  loading="lazy"
                />
              )}
              <div className="flex-grow">
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {sermon.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {sermon.contributorFullName}
                </p>
              </div>
              <div className="text-right text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 ml-4">
                <p className="flex flex-row items-center gap-x-1">
                  {formatNumber(sermon.views)}
                  <span className="">
                    <FiDownload />
                  </span>
                </p>
                <p>{formatDuration(sermon.duration)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
