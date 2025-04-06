import { Controls, useMediaState } from '@vidstack/react';

import * as Buttons from './buttons';
import * as Menus from './menus';
import * as Sliders from './sliders';
import { TimeGroup } from './time-group';
import { Gestures } from './gestures';
import { AudioCaptions, VideoCaptions } from '~/components/media/tracks';
import { Cover } from '~/components/media/features';
import { BufferingIndicator } from '~/components/media/buffering';
import { MiniPlay } from './buttons';

export interface CustomLayoutProps {
  title: string;
  author?: string;
  authorImageUrl?: string;
  hits?: number | undefined;
}

export const CustomLayout = ({
  title,
  author,
  authorImageUrl,
  hits,
}: CustomLayoutProps) => {
  const viewType = useMediaState('viewType');
  const controlStyleBottom =
    viewType === 'video'
      ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 rounded-b-xl to-transparent text-white media-paused:opacity-100 media-fullscreen:bottom-8 media-fullscreen:left-8 media-fullscreen:right-8'
      : 'flex flex-col media-fullscreen:text-white media-fullscreen:m-8';
  const controlStyleVideoTop =
    viewType === 'video'
      ? 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 rounded-t-xl to-transparent text-white media-fullscreen:top-8 media-fullscreen:left-8 media-fullscreen:right-8'
      : 'flex flex-col media-fullscreen:text-white media-fullscreen:m-8';

  return (
    <>
      <Gestures />
      <BufferingIndicator />

      <div className={'flex flex-col media-view-audio:w-full'}>
        <Controls.Root
          className={`p-4 opacity-0 transition-opacity duration-300 ease-in-out media-controls:opacity-100 media-paused:opacity-100 z-10 ${controlStyleVideoTop}`}
        >
          {/* Title, Author, and Views */}
          <Cover
            title={title}
            author={author}
            authorImageUrl={authorImageUrl}
            hits={hits}
          />
        </Controls.Root>

        {/* Captions */}
        {viewType === 'video' ? <VideoCaptions /> : <AudioCaptions />}

        <Controls.Root
          className={`p-4 opacity-0 transition-opacity duration-300 ease-in-out media-controls:opacity-100 z-10 ${controlStyleBottom}`}
        >
          {/* Time */}
          <Controls.Group>
            <Sliders.Time />
            <TimeGroup />
          </Controls.Group>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between">
            {/* Volume */}
            <Controls.Group className="flex items-center w-1/3">
              <Buttons.Mute tooltipPlacement="top" />
              <Sliders.Volume />
            </Controls.Group>

            {/* Play and Seek Buttons */}
            <Controls.Group className="flex items-center justify-center w-1/3">
              <Buttons.Seek seconds={-10} tooltipPlacement="top" />
              <Buttons.Play tooltipPlacement="top" />
              <Buttons.Seek seconds={10} tooltipPlacement="top" />
            </Controls.Group>

            {/* Settings */}
            <Controls.Group className="flex items-center justify-end w-1/3">
              <Buttons.Caption tooltipPlacement="top" />
              <Buttons.Fullscreen tooltipPlacement="top" />
              <Menus.Settings placement="top end" tooltipPlacement="top end" />
            </Controls.Group>
          </div>
        </Controls.Root>
      </div>
    </>
  );
};

export const MiniCustomLayout = () => {
  return (
    <>
      <BufferingIndicator />

      <div className={'flex w-full'}>
        <Controls.Root
          className={
            'w-full p-4 opacity-0 transition-opacity duration-300 ease-in-out media-controls:opacity-100 z-10'
          }
        >
          <div className={'flex w-full gap-x-1'}>
            <Controls.Group className={'items-center'}>
              <Buttons.MiniPlay tooltipPlacement="top" />
            </Controls.Group>

            <Controls.Group className={'items-center w-full'}>
              <Sliders.Time />
              <TimeGroup />
            </Controls.Group>
          </div>
        </Controls.Root>
      </div>
    </>
  );
};
