import { useSearchParams } from '@remix-run/react';
import { Contributor } from '~/api/interfaces';
import { StandardHeader } from '~/common/section';
import { SpeakerImagesDrawer } from './speaker-images';

interface SpeakerProps {
  contributor: Contributor;
  showImageLink?: boolean;
}

export const SpeakerBio = ({ contributor, showImageLink }: SpeakerProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <SpeakerImagesDrawer
        name={contributor.fullName}
        images={contributor.images}
      />
      <div>
        <StandardHeader text={contributor.fullName} />
        <div className={'p-4 flex'}>
          <img
            className="flex-none rounded-lg bg-slate-100 w-36 h-48 object-cover"
            loading={'lazy'}
            src={
              contributor.imageUrl ??
              'https://sermonindex1.b-cdn.net/default-si-speaker.png'
            }
            alt={contributor.fullName}
          />
          <div className="px-4">
            <p>{contributor.description}</p>
            {showImageLink && contributor.images.length > 0 && (
              <p
                className="pt-1 text-si-main dark:text-si-brown hover:underline hover:cursor-pointer"
                onClick={() => {
                  searchParams.set('images', 'true');
                  setSearchParams(searchParams);
                }}
              >
                {`See more ${contributor.fullName} images >>`}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
