import './base.css';

import { Sermon } from '~/api/interfaces';
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaViewType,
  Poster,
  Track,
} from '@vidstack/react';
import { useRef, useState } from 'react';
import { CustomLayout } from '~/components/media/layout';
import { hasContent } from '~/common/sanitize';

export interface PlayerProps {
  sermons: Sermon[];
}

export const Player = ({ sermons }: PlayerProps) => {
  let player = useRef<MediaPlayerInstance>(null);

  // Early return for zero length sermon list
  if (sermons.length < 1) {
    return <></>;
  }

  let currentSermon = sermons[0];
  let [viewType, setViewType] = useState<MediaViewType>(
    currentSermon.mediaType.toLowerCase() === 'video' ? 'video' : 'audio',
  );

  return (
    <>
      <div
        className={`${
          viewType === 'video'
            ? 'aspect-video'
            : 'w-full rounded-xl shadow-2xl bg-si-gray text-black dark:text-white dark:bg-si-dark'
        }`}
      >
        <MediaPlayer
          className={`w-full inline-flex items-center relative select-none overflow-hidden ${
            viewType === 'video' ? 'aspect-video shadow-2xl' : ''
          }`}
          title={currentSermon.title}
          // TODO: scrub this and make sure if the file does not end in .mp3 and does not have youtube like origin, than add .mp4
          src={currentSermon.streamUrl}
          playsInline
          crossOrigin
          viewType={viewType}
          ref={player}
        >
          <MediaProvider>
            {viewType === 'video' && (
              <Poster
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-xl opacity-0 transition-opacity data-[visible]:opacity-100 z-0"
                src={currentSermon.thumbnailUrl}
                alt={currentSermon.description}
              />
            )}
            {hasContent(currentSermon.vttUrl) &&
              hasContent(currentSermon.vttContent) && (
                <Track
                  kind="subtitles"
                  content={currentSermon.vttContent}
                  key={currentSermon.vttUrl}
                  language="en-US"
                  label="English"
                  type="vtt"
                  default
                />
              )}
          </MediaProvider>
          <CustomLayout
            title={currentSermon.title}
            author={currentSermon.contributorFullName}
          />
        </MediaPlayer>
      </div>
    </>
  );
};
