// Don't re-arrange these imports or else vidstack styling breaks
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

import React from 'react';
import { Sermon } from '~/api/interfaces';
import { formatDownloads } from '~/common/format-downloads';
import { hasContent, isNumber } from '~/common/sanitize';

export enum MessageType {
  Audio = 'audio',
  Video = 'video',
}

interface MessageComment {
  author: string;
  title: string;
  comment: string;
  likes: number;
}

interface MessagePlayerProps {
  title: string;
  speaker: string;
  media: MessageType;
  url: string;
  description: string;
  topic?: string; // todo: convert to array
  scriptures?: string[];
  iconUrl?: string;
  downloads?: number;
  comments?: MessageComment[];
  message?: MessagePlayerProps;
  bodyOnly?: boolean; // eeewwww, gross. I want to improve this...
}

export function sermonIntoMessagePlayerProps(
  sermon: Sermon,
): MessagePlayerProps {
  return {
    title: sermon.title,
    speaker: sermon.contributorFullName ?? '',
    media: sermon.audioUrl ? MessageType.Audio : MessageType.Video,
    url: sermon.audioUrl ?? sermon.videoUrl ?? '',
    description: sermon.description ?? '',
    topic: sermon.topics.join(', '),
    scriptures: sermon.bibleReferences,
    iconUrl: sermon.contributorImageUrl,
    downloads: sermon.hits,
    bodyOnly: true,
  };
}

export const MessageDescription = ({
  description,
}: {
  description: string;
}) => {
  if (hasContent(description)) {
    return (
      <div className="p-2 space-y-2">
        <p className="text-slate-700 text-sm italic">{description}</p>
        <div className="flex justify-end"></div>
      </div>
    );
  }
  return <div />;
};

export const MessageDownloads = ({
  downloads,
}: {
  downloads: number | undefined;
}) => {
  if (isNumber(downloads)) {
    return (
      <div className="flex justify-end pt-2">
        <p className={'text-si-main text-sm justify-right'}>
          {formatDownloads(downloads)} downloads
        </p>
      </div>
    );
  }
  return <div />;
};

export const SermonPlayer = (
  props: React.PropsWithChildren<{ sermon: Sermon }>,
) => {
  return <MessagePlayer {...sermonIntoMessagePlayerProps(props.sermon)} />;
};

/// Note that VidStack can render video sources as audio,
/// it also allows for multiple src tage, need to understand
/// more about the behavior of these.
export const MessagePlayer = (message: MessagePlayerProps) => {
  switch (message.media) {
    case MessageType.Video:
      return <VideoPlayer message={message} />;
    case MessageType.Audio:
      return <AudioPlayer message={message} />;
    default:
      /// We will assume this is a text message; right now, this does nothing
      return <div />;
  }
};

/// A simple video player that uses VidStack's MediaPlayer
///
/// todo list:
///  - Try to add the chrome cast / or air play buttons
///  - Try to add a customized thumbnail for the video player
export const VideoPlayer = (
  props: React.PropsWithChildren<{ message: MessagePlayerProps }>,
) => {
  const { message } = props;
  return (
    <div className="pt-2">
      <MessageDescription description={message.description} />
      <MediaPlayer title={message.title} src={message.url}>
        <MediaProvider />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          colorScheme="light"
          slots={{ googleCastButton: true }}
        />
      </MediaPlayer>
      <MessageDownloads downloads={message.downloads} />
    </div>
  );
};

/// A simple audio player that uses VidStack's MediaPlayer
///
/// todo list:
///  - Try to add the chrome cast / or air play buttons
///  - Try to add a download button
///  - Try to add a share button / copy link button
///
/// There is a lot to be desired in this component, but it is a good starting point.
export const AudioPlayer = (
  props: React.PropsWithChildren<{ message: MessagePlayerProps }>,
) => {
  const { message } = props;
  return (
    <div>
      {message.bodyOnly ? (
        <div className="p-2 space-y-2">
          <p className="text-slate-700 text-sm italic">{message.description}</p>
          <div className="flex justify-end">
            <p className="text-si-main text-sm justify-right">
              {formatDownloads(message.downloads)} downloads
            </p>
          </div>
        </div>
      ) : (
        <div className={'p-2 flex items-start space-x-4'}>
          <img
            src={message.iconUrl}
            alt={message.speaker}
            className="flex-none rounded-lg bg-slate-100"
            loading={'lazy'}
          />
          <div className="flex-auto space-y-2">
            <h2
              className={
                'text-slate-900 text-lg leading-6 font-semibold truncate'
              }
            >
              {message.title}
            </h2>
            <div
              className={
                'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 leading-6 text-sm'
              }
            >
              <p className={'text-si-main'}>
                {/* todo: make speaker link to speaker page */}
                <abbr title={'Speaker'}>by</abbr> {message.speaker}
              </p>
              <p className={'text-si-main'}>Topic: {message.topic}</p>
              <p className={'text-si-main'}>
                Scripture(s): {message.scriptures?.join(', ')}
              </p>
            </div>
            <p className={'text-slate-700 text-sm italic'}>
              {message.description}
            </p>
            <div className="flex justify-end">
              <p className={'text-si-main text-sm justify-right'}>
                {formatDownloads(message.downloads)} downloads
              </p>
            </div>
          </div>
        </div>
      )}
      <div>
        <MediaPlayer title={message.title} src={message.url}>
          <MediaProvider />
          <DefaultAudioLayout
            icons={defaultLayoutIcons}
            colorScheme="light"
            slots={{ googleCastButton: true }}
          />
        </MediaPlayer>
      </div>
    </div>
  );
};
