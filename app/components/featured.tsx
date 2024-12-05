import React from 'react';
import { Sermon } from '~/api/interfaces';
import { StandardHeader } from '~/common/section';
import { MessagePlayer, MessagePlayerProps, MessageType } from './player';

interface FeaturedMessageProps {
  sermon: Sermon;
}

export const FeaturedMessage: React.FC<FeaturedMessageProps> = ({ sermon }) => {
  /// Theoretically featured would just take a SID (sermon id) and use the API to get the rest of this info
  const message: MessagePlayerProps = {
    sermon: sermon,
    media: MessageType.Audio, // For now, we force all featured messages to be audio
    bodyOnly: false,
  };

  return (
    <div className="px-4 pt-4 w-full">
      <StandardHeader text={'Featured Message'} />
      <div className="p-2">
        <MessagePlayer message={message} />
      </div>
    </div>
  );
};
