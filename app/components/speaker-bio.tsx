import { Contributor } from '~/api/interfaces';
import { ClickableText, SiSection } from '~/components/section';
import { Link } from '@remix-run/react';
import React from 'react';

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
          src={
            contributor.imageUrl ??
            'https://sermonindex1.b-cdn.net/default-si-speaker.png'
          }
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
