import React from 'react';
import { Sermon } from '~/api/interfaces';
import { StandardHeader } from '~/common/section';
import { MessagePlayer, MessageType } from '~/components/player';

interface FeaturedMessageProps {
  sermon: Sermon;
}

export const FeaturedMessage: React.FC<FeaturedMessageProps> = ({ sermon }) => {
  /// Theoretically featured would just take a SID (sermon id) and use the API to get the rest of this info
  return (
    <div className="px-4 pt-4">
      <StandardHeader text={'Featured Message'} />
      <div className="bg-white">
        <div className="p-2">
          <MessagePlayer
            title={sermon.title}
            url={sermon.audioUrl ?? ''}
            iconUrl={sermon.contributorImageUrl}
            speaker={sermon.contributorFullName}
            description={sermon.description ?? ''}
            media={MessageType.Audio}
            downloads={sermon.hits ?? 0}
            // TODO: Topics can be a list probably?
            topic={sermon.topics.join(', ')}
            scriptures={sermon.bibleReferences}
            // todo: experiment with comments
          />
        </div>
      </div>
    </div>
  );
};
