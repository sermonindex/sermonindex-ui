import React from 'react';
import { Sermon } from '~/api/interfaces';
import { SiSection } from '~/components/section';
import { MessagePlayer, MessagePlayerProps } from './player';

interface FeaturedMessageProps {
  sermon: Sermon;
}

export const FeaturedMessage: React.FC<FeaturedMessageProps> = ({ sermon }) => {
  /// Theoretically featured would just take a SID (sermon id) and use the API to get the rest of this info
  const message: MessagePlayerProps = {
    sermon: sermon,
    bodyOnly: false,
  };

  return (
    <SiSection title={'Featured Message'}>
      <MessagePlayer message={message} />
    </SiSection>
  );
};
