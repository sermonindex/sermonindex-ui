import { Link } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { Sermon } from '~/api/interfaces';
import { StandardHeader } from '~/common/section';

interface SermonCarouselProps {
  title: string;
  sermons: Sermon[];
  customizer?: (sermon: Sermon) => JSX.Element;
}

export const SermonCarousel: React.FC<SermonCarouselProps> = ({
  title,
  sermons,
  customizer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const getItemsToShow = () => {
    // TODO: Adjust the number of items shown based on the screen size
    // I had issues with importing the tailwind config so I hardcoded the value
    return 4;

    // if (windowWidth >= parseInt(tailwindConfig.screens.xl, 10)) return 4;
    // if (windowWidth >= parseInt(tailwindConfig.screens.lg, 10)) return 3;
    // if (windowWidth >= parseInt(tailwindConfig.screens.md, 10)) return 2;
    // return 1;
  };

  const nextItem = () => {
    setCurrentIndex(Math.min(currentIndex + 1, sermons.length - 1));
  };

  const previousItem = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleItems = sermons.slice(
    currentIndex,
    currentIndex + getItemsToShow(),
  );

  return (
    // TODO: Style for mobile
    <div className="px-4">
      <StandardHeader text={title} />
      <div className="flex w-full">
        <span className="flex items-center">
          <button
            onClick={previousItem}
            disabled={currentIndex === 0}
            className="px-4 py-6 rounded-full hover:bg-gray-200"
          >
            ❮
          </button>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-72 overflow-hidden">
          {visibleItems.map((sermon, index) => (
            <div key={index} className="h-72">
              <div className="flex flex-col p-4">
                {customizer ? customizer(sermon) : <></>}
                <span className="text-lg font-semibold truncate">
                  {sermon.title}
                </span>
                <span className="pb-4">
                  <span className="font-light">by </span>
                  <span className="font-medium">
                    {sermon.contributorFullName}
                  </span>
                </span>

                <span className="h-32">
                  <span className="text-sm line-clamp-6">
                    {sermon.description}
                  </span>
                </span>
                <Link
                  to={`/sermons/${sermon.id}`}
                  className="flex items-center space-x-2 text-lg pt-2 hover:text-si-main"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  <span>LISTEN NOW</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <span className="flex items-center">
          <button
            onClick={nextItem}
            disabled={currentIndex >= sermons.length - getItemsToShow()}
            className="px-4 py-6 rounded-full hover:bg-gray-200"
          >
            ❯
          </button>
        </span>
      </div>
    </div>
  );
};

export default SermonCarousel;
