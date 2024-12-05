// Don't re-arrange these imports or else vidstack styling breaks
import '@vidstack/react/player/styles/default/theme.css';

import '@vidstack/react/player/styles/default/layouts/audio.css';

import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';

import { Link } from '@remix-run/react';
import React, { useState } from 'react';
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
  speakerSlug: string;
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
    speakerSlug: sermon.contributorFullNameSlug,
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
        <p>{description}</p>
        <div className="flex justify-end"></div>
      </div>
    );
  }
  return <div className="p-2"></div>;
};

export const MessageDownloads = ({
  downloads,
}: {
  downloads: number | undefined;
}) => {
  if (isNumber(downloads)) {
    return (
      <div className="flex justify-end pt-2">
        <p className={'text-sm justify-right'}>
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
///  - ~~Add slider to switch between video and audio~~ DONE
///  - Try to add the chrome cast / or air play buttons
///  - Try to add a customized thumbnail for the video player
///  - Try to add a download button (Maybe just for audio somehow?)
export const VideoPlayer = (
  props: React.PropsWithChildren<{ message: MessagePlayerProps }>,
) => {
  const { message } = props;
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video');

  const handleMediaTypeChange = (type: 'video' | 'audio') => {
    setMediaType(type);
  };

  return (
    <div className="pt-2">
      <MessageDescription description={message.description} />

      {/* Conditionally render Video or Audio player */}
      {mediaType === 'video' ? (
        <div>
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
      ) : (
        <AudioPlayer message={message} />
      )}

      {/* Slider for media type selection */}
      <div className="flex items-center justify-center space-x-4">
        <span className="text-sm">Audio</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={mediaType === 'video'}
            onChange={() =>
              handleMediaTypeChange(mediaType === 'video' ? 'audio' : 'video')
            }
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-si-main dark:peer-focus:ring-si-main rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-si-main"></div>
          <span className="ml-3 text-sm">Video</span>
        </label>
      </div>
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
        <MessageDescription description={message.description} />
      ) : (
        <div>
          <div className={'p-2 flex items-start space-x-4'}>
            <img
              src={
                message.iconUrl
                  ? message.iconUrl
                  : 'https://sermonindex1.b-cdn.net/default-si-speaker.png'
              }
              alt={message.speaker}
              className="h-20 md:h-28 flex-none rounded-lg bg-slate-100"
              loading={'lazy'}
            />
            <div className="flex flex-col">
              <h2 className={'text-lg leading-6 font-semibold text-wrap'}>
                {message.title}
              </h2>
              <span>
                by{' '}
                <span className="underline md:hover:underline">
                  <Link to={`/speakers/${message.speakerSlug}`}>
                    {message.speaker}
                  </Link>
                </span>
              </span>
              <p className="hidden md:inline pt-4">{message.description}</p>
            </div>
          </div>
        </div>
      )}
      <div>
        <MediaPlayer title={message.title} src={message.url} viewType="audio">
          <MediaProvider />
          <DefaultAudioLayout icons={defaultLayoutIcons} colorScheme="light" />
        </MediaPlayer>
        <MessageDownloads downloads={message.downloads} />
      </div>
    </div>
  );
};
