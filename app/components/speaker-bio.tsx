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
      <div className={'flow-root'}>
        <img
          className="float-left rounded-lg bg-slate-100 w-36 h-48 object-cover mr-4 mb-2"
          loading={'lazy'}
          src={contributor.imageUrl}
          alt={contributor.fullName}
        />
        <p>{contributor.description}</p>
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
