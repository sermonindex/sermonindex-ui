import { Link } from '@remix-run/react';
import { Contributor } from '~/api/interfaces';
import { ClickableText } from '~/components/section';

interface SpeakerProps {
  contributor: Contributor;
  seeAllLinkVisible?: boolean;
}

export const SpeakerBio = ({
  contributor,
  seeAllLinkVisible,
}: SpeakerProps) => {
  return (
    <>
      <div className={'flex'}>
        <img
          className="flex-none rounded-lg bg-slate-100 w-36 h-48 object-cover"
          loading={'lazy'}
          src={contributor.imageUrl}
          alt={contributor.fullName}
        />
        <div className="px-4">
          <p>{contributor.description}</p>
        </div>
      </div>
      {seeAllLinkVisible && (
        <div className="py-2">
          <Link to={`/speakers/${contributor.fullNameSlug}#sermon-list`}>
            <ClickableText>
              See all {contributor.sermonCount} sermons by{' '}
              {contributor.fullName}
            </ClickableText>
          </Link>
        </div>
      )}
    </>
  );
};
