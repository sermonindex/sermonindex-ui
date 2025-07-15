import { Link } from '@remix-run/react';
import { hasContent } from '~/common/sanitize';
import { SiParagraph } from '~/components/si-styles';
import { formatNumber } from '~/common/format-number';

export interface TeaserProps {
  type: string;
  title: string;
  link: string;
  imageUrl?: string;
  text?: string;
  author?: string;
  date?: string;
  mediaType?: string;
  views?: number;
}

export const Teaser = ({
  type,
  title,
  link,
  imageUrl,
  text,
  author,
  date,
  mediaType,
  views,
}: TeaserProps) => {
  return (
    <Link to={link} key={title} className="block h-full group">
      <div className="h-full flex flex-col max-w-96 bg-white/50 dark:bg-black/30 rounded-md border border-gray-200 border-t-4 border-t-si-accent shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <div className="p-5 flex flex-col flex-grow">
          {/* Top Section */}
          <div>
            <div className="pt-1 mb-4 border-b border-gray-200 w-full">
              <span className="text-xs font-bold tracking-widest text-gray-700 dark:text-gray-300 uppercase">
                {type}
              </span>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-grow flex flex-col justify-center my-4">
            {imageUrl && (
              <div className="flex justify-center overflow-hidden rounded-lg">
                {/* We use max-h-64 to constrain the image height, keeping layout consistent. */}
                <img
                  className="object-cover max-h-64 rounded-lg"
                  src={imageUrl}
                  alt={title}
                />
              </div>
            )}

            {!hasContent(imageUrl) && text && (
              <SiParagraph className="line-clamp-[9]">{text}</SiParagraph>
            )}
          </div>

          {/* Bottom Section */}
          <div>
            <h2 className="text-xl text-si-main dark:text-si-brown font-light mb-2">
              {title}
            </h2>

            {author && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                by {author}
                {date && ` on ${date}`}
              </p>
            )}

            {mediaType && (
              <div className="pt-2 text-sm text-gray-800 dark:text-gray-200 border-t border-gray-400">
                <div className="flex justify-between items-center">
                  <span>{mediaType}</span>
                  {typeof views === 'number' && (
                    <span className="font-medium">
                      {`${formatNumber(views)} views`}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
