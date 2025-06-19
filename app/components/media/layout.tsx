import { Controls, MediaErrorDetail, useMediaState } from '@vidstack/react';

import * as Buttons from './buttons';
import * as Menus from './menus';
import * as Sliders from './sliders';
import { TimeGroup } from './time-group';
import { Gestures } from './gestures';
import { AudioCaptions, VideoCaptions } from '~/components/media/tracks';
import { Cover } from '~/components/media/features';
import {
  BufferingIndicator,
  MiniBufferingIndicator,
} from '~/components/media/buffering';
import { SiMediaError } from '~/components/media/error';

export interface CustomLayoutProps {
  className?: string;
  title: string;
  author?: string;
  authorImageUrl?: string;
  hits?: number | undefined;
  isSearchOpen: boolean;
  toggleSearch: () => void;
  isPlaylistMode: boolean;
  errorDetail: MediaErrorDetail | null;
  nextCallback?: () => void;
  prevCallback?: () => void;
  downloadUrl?: string;
}

export const CustomLayout = ({
  className,
  title,
  author,
  authorImageUrl,
  hits,
  isSearchOpen,
  toggleSearch,
  isPlaylistMode,
  errorDetail,
  nextCallback,
  prevCallback,
  downloadUrl,
}: CustomLayoutProps) => {
  const viewType = useMediaState('viewType');
  const hasError = errorDetail !== null;

  const controlBaseClasses = `opacity-0 transition-opacity duration-300 ease-in-out media-controls:opacity-100 media-paused:opacity-100`;
  const controlStyleBottom =
    viewType === 'video'
      ? `absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white sm:rounded-b-xl z-10 media-fullscreen:bottom-4 media-fullscreen:left-4 media-fullscreen:right-4 ${controlBaseClasses}`
      : `flex flex-col p-4 media-fullscreen:text-white media-fullscreen:m-8 ${controlBaseClasses} z-10`;
  const controlStyleVideoTop =
    viewType === 'video'
      ? `absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 text-white sm:rounded-t-xl z-10 media-fullscreen:top-4 media-fullscreen:left-4 media-fullscreen:right-4 ${controlBaseClasses}`
      : `flex flex-col p-4 media-fullscreen:text-white media-fullscreen:m-8 ${controlBaseClasses} z-20`;

  const outerDivBaseClass = `relative w-full h-full`; // Base styles for the container

  return (
    <div className={`${outerDivBaseClass} ${className || ''}`}>
      <Gestures />
      {viewType !== 'video' && !hasError && <BufferingIndicator />}

      {/* Inner container for layout flow */}
      <div
        className={`w-full h-full ${
          viewType === 'audio' ? 'flex flex-col' : ''
        }`}
      >
        {/* --- Top Controls --- */}
        <div className={''}>
          <Controls.Root
            className={`${controlStyleVideoTop} ${
              viewType === 'video' ? 'flex flex-col w-full' : ''
            }`}
          >
            <Cover
              title={title}
              author={author}
              authorImageUrl={authorImageUrl}
              hits={hits}
              isSearchOpen={isSearchOpen}
              onSearchIconClick={toggleSearch}
              isPlaylistMode={isPlaylistMode}
            />
          </Controls.Root>
        </div>

        {/* Error Div */}
        {hasError && <SiMediaError detail={errorDetail} />}

        {/* --- Captions --- */}
        <div className={`${viewType === 'audio' ? 'flex-1' : ''} relative`}>
          {viewType === 'video' ? <VideoCaptions /> : <AudioCaptions />}
        </div>

        {/* --- Bottom Controls --- */}
        <Controls.Root className={controlStyleBottom}>
          <Controls.Group>
            <Sliders.Time />
            <TimeGroup />
          </Controls.Group>
          <div className="flex items-center justify-between mt-2">
            <Controls.Group className="flex items-center w-1/3">
              <Buttons.Mute tooltipPlacement="top" />
              <Sliders.Volume />
            </Controls.Group>
            <Controls.Group className="flex items-center justify-center w-1/3 gap-x-1">
              {isPlaylistMode && (
                <Buttons.Skip
                  direction="backward"
                  onSkipClick={prevCallback}
                  tooltipPlacement="top"
                />
              )}
              {!isPlaylistMode && (
                <Buttons.Seek seconds={-10} tooltipPlacement="top" />
              )}
              <Buttons.Play tooltipPlacement="top" />
              {!isPlaylistMode && (
                <Buttons.Seek seconds={10} tooltipPlacement="top" />
              )}
              {isPlaylistMode && (
                <Buttons.Skip
                  direction="forward"
                  onSkipClick={nextCallback}
                  tooltipPlacement="top"
                />
              )}
            </Controls.Group>
            <Controls.Group className="flex items-center justify-end w-1/3 gap-x-1">
              <Buttons.Caption tooltipPlacement="top" />
              <Buttons.Fullscreen tooltipPlacement="top" />
              <Buttons.PIP tooltipPlacement="top" />
              <Menus.Settings
                placement="top end"
                tooltipPlacement="top end"
                downloadUrl={downloadUrl}
              />
            </Controls.Group>
          </div>
        </Controls.Root>
      </div>
    </div>
  );
};

export interface MiniLayoutProps {
  displayLength?: number;
}

export const MiniCustomLayout = ({ displayLength }: MiniLayoutProps) => {
  return (
    <>
      <MiniBufferingIndicator />

      <div className={'flex w-full'}>
        <Controls.Root
          className={
            'w-full p-4 opacity-0 transition-opacity duration-300 ease-in-out media-controls:opacity-100 z-10'
          }
        >
          <div className={'flex w-full gap-x-1'}>
            <Controls.Group className={'items-center'}>
              <Buttons.Play tooltipPlacement="top" size="md" />
            </Controls.Group>

            <Controls.Group className={'items-center w-full'}>
              <Sliders.Time />
              <TimeGroup displayLength={displayLength} />
            </Controls.Group>
          </div>
        </Controls.Root>
      </div>
    </>
  );
};
