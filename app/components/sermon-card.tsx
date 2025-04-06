import { IconContext } from 'react-icons';
import { FaVideo, FaVolumeUp } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { IoDocumentText } from 'react-icons/io5';
import { MediaType, SermonInfo } from '~/api/interfaces';
import { formatNumber } from '~/common/format-number';

interface SermonCardProps {
  sermon: SermonInfo;
  showContributor?: boolean;
  showMediaPlayer?: boolean;
  className?: string;
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

export function SermonCard({
  sermon,
  showContributor = false,
  showMediaPlayer = false,
  className = '',
}: SermonCardProps) {
  const speakerImage =
    sermon.contributorImageUrl ??
    'https://sermonindex1.b-cdn.net/default-si-speaker.png';
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
              className="w-8 h-8 md:w-12 md:h-12 rounded-full"
              src={speakerImage}
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
            {formatNumber(sermon.hits)}
            <IconContext.Provider value={{ className: 'ml-1 w-4 h-4' }}>
              <FiDownload />
            </IconContext.Provider>
          </span>
          {sermon.mediaType !== MediaType.Text && <span>42:11</span>}
          <IconContext.Provider value={{ className: 'mt-[4px]' }}>
            {getMediaIcon(sermon)}
          </IconContext.Provider>
        </div>
      </div>
      {addLabels && (
        <div className="flex flex-wrap py-2 gap-y-1">
          {sermon.topics.map((topic) => (
            <span
              className="text-black dark:text-white bg-si-olive dark:bg-si-main text-xs font-medium me-2 px-2.5 py-0.5 rounded-md"
              key={topic}
            >
              {topic}
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
        <p
          className={
            sermon.description ? 'text-xs md:text-sm line-clamp-6 mb-1' : ''
          }
        >
          {sermon.description}
        </p>
      </div>
    </div>
  );
}
