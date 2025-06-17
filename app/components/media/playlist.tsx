import { Sermon } from '~/api/interfaces';
import { hasContent } from '~/common/sanitize';
import { formatNumber } from '~/common/format-number';
import { formatDuration } from '~/common/format-duration.fn';

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
    <div className="p-2 bg-white dark:bg-gray-900 -mt-2">
      <ul className="space-y-1">
        {sermons.map((sermon, index) => {
          const isCurrentItem = index === currentIndex;

          return (
            <li
              key={sermon.id}
              onClick={() => onPlaylistItemClick(index)}
              className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                isCurrentItem
                  ? 'bg-blue-200 dark:bg-blue-900/50' // Active item style
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer' // Inactive item style
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
                <p>{formatNumber(sermon.views)} views</p>
                <p>{formatDuration(sermon.duration)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
