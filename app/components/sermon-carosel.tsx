import { useEffect, useState } from "react";

interface SermonCarouselProps {
  title: string;
  sermons: Partial<Sermon>[];
  customizer?: (sermon: Partial<Sermon>) => JSX.Element;
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
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleItems = sermons.slice(
    currentIndex,
    currentIndex + getItemsToShow()
  );

  return (
    // TODO: Style for mobile
    // TODO: Link the sermon to the sermon page
    <div className="p-4 bg-white text-black">
      <h1 className="text-2xl pl-4 py-2 bg-gray-300 rounded-lg w-full">
        {title}
      </h1>
      <div className="flex w-full">
        <button
          onClick={previousItem}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-l-lg rounded-r-none hover:bg-gray-200"
        >
          ❮
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-72 overflow-hidden">
          {visibleItems.map((sermon, index) => (
            <div key={index} className="h-72">
              <div className="flex flex-col p-4">
                {customizer ? customizer(sermon) : <></>}
                <span className="text-lg font-semibold truncate">
                  {sermon.title}
                </span>
                <span className="font-medium pb-4">
                  <span className="font-light">by</span>{" "}
                  {` ${sermon.contributor?.fullName}`}
                </span>

                <span className="h-32">
                  <span className="text-sm line-clamp-6">
                    {sermon.description}
                  </span>
                </span>
                <span className="flex items-center space-x-2 text-lg pt-2">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />{" "}
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  <span>LISTEN NOW</span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={nextItem}
          disabled={currentIndex >= sermons.length - getItemsToShow()}
          className="px-4 py-2 rounded-r-lg rounded-l-none hover:bg-gray-200"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default SermonCarousel;
