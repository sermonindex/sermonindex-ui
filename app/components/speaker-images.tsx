import { useSearchParams } from '@remix-run/react';
import { ContributorImage } from '~/api/interfaces';
import { StandardHeader } from '~/common/section';

export interface SpeakerImagesDrawerProps {
  name: string;
  images: ContributorImage[];
}

export const SpeakerImagesDrawer = ({
  name,
  images,
}: SpeakerImagesDrawerProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const showImages = searchParams.get('images') === 'true';

  return (
    <div
      className={`fixed top-0 z-40 h-screen w-full md:w-3/4 lg:w-1/2 xl:w-2/5 overflow-y-auto transition-transform bg-si-light dark:bg-si-slate border-r-2 border-si-gray dark:border-si-dim ${
        showImages ? 'left-0 translate-x-0' : 'left-[-100%] translate-x-[-100%]'
      }`}
    >
      <span className="flex w-full justify-end py-1 px-2">
        <button
          onClick={() => {
            searchParams.delete('images');
            setSearchParams(searchParams);
          }}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </span>
      <div className="p-4">
        <StandardHeader text={`${name} Images`} />
        {images.map((image) => (
          <div className="py-2">
            <div className="relative">
              <a href={image.url} target="_blank">
                <img
                  src={image.url}
                  className="rounded-lg bg-slate-100 w-full"
                />
              </a>
              {image.description && image.description != 'nil' && (
                <div className="absolute bottom-0 left-0 w-full h-1/8 bg-black bg-opacity-50">
                  <p className="text-white text-sm p-2">{image.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
