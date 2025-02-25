import { Contributor } from '~/api/interfaces';
import { StandardHeader } from '~/common/section';

interface SpeakerProps {
  contributor: Contributor;
}

export const SpeakerBio = ({ contributor }: SpeakerProps) => {
  return (
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
        </div>
      </div>
    </div>
  );
};
