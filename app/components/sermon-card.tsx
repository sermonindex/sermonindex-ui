import { IconContext } from 'react-icons';
import { FiDownload } from 'react-icons/fi';
import { MediaType, SermonInfo } from '~/api/interfaces';
import { formatDuration } from '~/common/format-duration.fn';
import { formatNumber } from '~/common/format-number';
import { MediaIcon } from './media-icon';

interface SermonCardProps {
  sermon: SermonInfo;
  showContributor?: boolean;
  showMediaPlayer?: boolean;
  className?: string;
}

export function SermonCard({
  sermon,
  showContributor = false,
  showMediaPlayer = false,
  className = '',
}: SermonCardProps) {
  const addLabels =
    sermon.bibleReferences.length > 0 || sermon.topics.length > 0;

  return (
    <div
      className={`flex flex-col px-2 py-2 md:px-6 md:py-4 bg-si-light border border-neutral-200 rounded-lg shadow-sm dark:bg-si-slate dark:border-neutral-600 ${className}`}
    >
      <div className="flex justify-between space-x-2 md:space-x-12">
        <div className="flex items-start space-x-2">
          {showContributor && (
            <img
              className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
              src={sermon.contributorImageUrl}
              alt={sermon.contributorFullName}
            />
          )}
          <div className="flex flex-col">
            <h3 className="text-sm md:text-lg font-semibold">{sermon.title}</h3>
            {showContributor && (
              <span className="text-xs md:text-sm">
                By {sermon.contributorFullName}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2 md:space-x-4 items-start text-sm text-gray-600 dark:text-gray-200">
          <span className="flex items items-center">
            {formatNumber(sermon.views)}
            <IconContext.Provider value={{ className: 'ml-1 w-4 h-4' }}>
              <FiDownload />
            </IconContext.Provider>
          </span>
          {sermon.mediaType !== MediaType.Text && (
            <span>{formatDuration(sermon.duration)}</span>
          )}
          <IconContext.Provider value={{ className: 'mt-[4px]' }}>
            <MediaIcon mediaType={sermon.mediaType} />
          </IconContext.Provider>
        </div>
      </div>
      {addLabels && (
        <div className="flex flex-wrap py-2 gap-y-1">
          {sermon.topics.map((topic) => (
            <span
              className="text-black dark:text-white bg-si-olive dark:bg-si-main text-xs font-medium me-2 px-2.5 py-0.5 rounded-md"
              key={topic.slug}
            >
              {topic.name}
            </span>
          ))}
          {sermon.bibleReferences.map((reference) => (
            <span
              className="text-slate-800 dark:text-white bg-si-accent text-xs font-medium me-2 px-2.5 py-0.5 rounded-md"
              key={reference.text}
            >
              {reference.book} {reference.startChapter}:{reference.startVerse}
            </span>
          ))}
        </div>
      )}
      <div className="flex space-x-4">
        {sermon.mediaType === MediaType.Video && (
          <img
            className="w-32 h-24 md:w-48 md:h-32 rounded-lg"
            src={sermon.thumbnailUrl}
            alt={sermon.title}
          />
        )}
        <p className={sermon.description ? 'line-clamp-5 mb-1' : ''}>
          {sermon.description}
        </p>
      </div>
      {/* <div onClick={(event) => event.stopPropagation()}>
        <MiniPlayer
          sermon={sermon as any as Sermon}
          loadStrategy={'play'}
          displayLength={sermon.duration}
        />
      </div> */}
    </div>
  );
}
