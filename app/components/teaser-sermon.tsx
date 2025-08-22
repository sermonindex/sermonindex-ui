import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import { FiDownload } from 'react-icons/fi';
import { SermonInfo } from '~/api/interfaces';
import { formatNumber } from '~/common/format-number';

export interface TeaserSermonProps {
  sermon: SermonInfo;
}

export const TeaserSermon = ({ sermon }: TeaserSermonProps) => {
  return (
    <div className="relative flex-shrink group">
      {/* Invisible full-link */}
      <Link
        to={`/sermons/${sermon.id}`}
        className="absolute inset-0 z-10"
        aria-label={sermon.title}
      />

      {/* Visible content */}
      <div className="relative z-0 h-full w-full flex flex-col bg-white/50 dark:bg-black/30 rounded-md border border-gray-200 border-t-4 border-t-si-accent shadow-md transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex space-x-2 md:space-x-4">
            <img
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-48 float-left rounded-full md:rounded-lg flex-shrink-0 object-cover mr-2 mb-2"
              src={sermon.contributorImageUrl}
              alt={sermon.contributorFullName}
              loading="lazy"
            />
            <div className="flex flex-col">
              <div className="flex justify-between space-x-2 md:space-x-12">
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col">
                    <h3 className="text-lg md:text-xl font-semibold">
                      {sermon.title}
                    </h3>
                    <span className="text-xs md:text-sm">
                      By {sermon.contributorFullName}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="flex items items-center text-sm text-gray-600 dark:text-gray-200">
                    {formatNumber(sermon.views)}
                    <IconContext.Provider value={{ className: 'ml-1 w-4 h-4' }}>
                      <FiDownload />
                    </IconContext.Provider>
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap py-2 gap-y-1">
                {sermon.topics.map((topic) => (
                  <span
                    className="text-black dark:text-white bg-si-olive dark:bg-si-main text-xs font-medium me-2 px-2.5 py-0.5 rounded-md"
                    key={topic.slug}
                  >
                    {topic.name}
                  </span>
                ))}
                {sermon.bibleReferences.map((reference, index) => (
                  <span
                    className="text-slate-800 dark:text-white bg-si-accent text-xs font-medium me-2 px-2.5 py-0.5 rounded-md"
                    key={`${index} - ${reference.text}`}
                  >
                    {reference.book} {reference.startChapter}:
                    {reference.startVerse}
                  </span>
                ))}
              </div>
              <p className="text-sm line-clamp-5">{sermon.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
