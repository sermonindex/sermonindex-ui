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
  shuffleState?: 'off' | 'on';
  onShuffleStateChange: (state: 'off' | 'on') => void;
  repeatState?: 'none' | 'repeat-all' | 'repeat-one';
  onRepeatStateChange: (state: 'none' | 'repeat-all' | 'repeat-one') => void;
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
  shuffleState = 'off',
  onShuffleStateChange,
  repeatState = 'none',
  onRepeatStateChange,
}: CustomLayoutProps) => {
  const viewType = useMediaState('viewType');
  const hasError = errorDetail !== null;

  const controlBaseClasses = `opacity-0 transition-opacity duration-300 ease-in-out media-controls:opacity-100 media-paused:opacity-100`;

  const bottomControlsContainerClasses =
    viewType === 'video'
      ? `absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent sm:rounded-b-xl z-10 ${controlBaseClasses} text-white`
      : `flex flex-col group-data-[fullscreen]:text-white ${controlBaseClasses} z-10`;

  const topControlsContainerClasses =
    viewType === 'video'
      ? `absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent sm:rounded-t-xl z-10 ${controlBaseClasses} text-white`
      : `flex flex-col group-data-[fullscreen]:text-white ${controlBaseClasses} z-10`;

  const topPaddingWrapperClasses = `p-4 group-data-[fullscreen]:pt-6 group-data-[fullscreen]:px-6`;
  const bottomPaddingWrapperClasses = `p-4 group-data-[fullscreen]:pb-6 group-data-[fullscreen]:px-6`;

  const outerDivBaseClass = `relative w-full h-full`; // Base styles for the container

  return (
    <div className={`${outerDivBaseClass} ${className || ''}`}>
      <Gestures />
      {viewType !== 'video' && !hasError && <BufferingIndicator />}

      {/* Inner container for layout flow */}
      <div
        className={`w-full h-full ${
          viewType === 'audio' ? 'flex flex-col' : 'flex flex-col'
        }`}
      >
        {/* --- Top Controls --- */}
        <Controls.Root className={topControlsContainerClasses}>
          <div className={topPaddingWrapperClasses}>
            <Cover
              title={title}
              author={author}
              authorImageUrl={authorImageUrl}
              hits={hits}
              isSearchOpen={isSearchOpen}
              onSearchIconClick={toggleSearch}
              isPlaylistMode={isPlaylistMode}
              onShuffleStateChange={onShuffleStateChange}
              shuffleState={shuffleState}
              onRepeatStateChange={onRepeatStateChange}
              repeatState={repeatState}
            />
          </div>
        </Controls.Root>

        {/* Error Div */}
        {hasError && <SiMediaError detail={errorDetail} />}

        {/* --- Captions --- */}
        <div
          className={`relative ${
            viewType === 'video'
              ? 'flex-1 flex flex-col justify-end'
              : 'flex-1 relative'
          }`}
        >
          {viewType === 'video' ? <VideoCaptions /> : <AudioCaptions />}
        </div>

        {/* --- Bottom Controls --- */}
        <Controls.Root className={bottomControlsContainerClasses}>
          <div className={bottomPaddingWrapperClasses}>
            <Controls.Group>
              <Sliders.Time />
              <TimeGroup />
            </Controls.Group>
            <div className="flex items-center justify-between mt-1 sm:mt-2">
              <Controls.Group className="flex items-center w-1/3">
                <Buttons.Mute tooltipPlacement="top" />
                <Sliders.Volume />
              </Controls.Group>
              <Controls.Group className="flex items-center justify-center w-1/3 gap-x-1">
                {isPlaylistMode && (
                  <div className="flex items-center gap-x-2">
                    <div className="hidden sm:block">
                      <Buttons.Shuffle
                        onShuffleStateChange={onShuffleStateChange}
                        state={shuffleState}
                        tooltipPlacement="top"
                      />
                    </div>
                    <Buttons.Skip
                      direction="backward"
                      onSkipClick={prevCallback}
                      tooltipPlacement="top"
                    />
                  </div>
                )}
                {!isPlaylistMode && (
                  <Buttons.Seek seconds={-10} tooltipPlacement="top" />
                )}
                <Buttons.Play tooltipPlacement="top" />
                {!isPlaylistMode && (
                  <Buttons.Seek seconds={10} tooltipPlacement="top" />
                )}
                {isPlaylistMode && (
                  <div className="flex items-center gap-x-2">
                    <Buttons.Skip
                      direction="forward"
                      onSkipClick={nextCallback}
                      tooltipPlacement="top"
                    />
                    <div className="hidden sm:block">
                      <Buttons.Repeat
                        onRepeatStateChange={onRepeatStateChange}
                        state={repeatState}
                        tooltipPlacement="top"
                      />
                    </div>
                  </div>
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
