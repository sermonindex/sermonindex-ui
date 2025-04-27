import './base.css';

import { Sermon } from '~/api/interfaces';
import {
  MediaLoadingStrategy,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaViewType,
  Poster,
  Track,
  useMediaStore,
} from '@vidstack/react';
import { useEffect, useRef, useState } from 'react';
import { CustomLayout, MiniCustomLayout } from '~/components/media/layout';
import { hasContent } from '~/common/sanitize';
import { MediaSearch } from '~/components/media/search';

// Using allotment to help resize the search panel
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

export interface PlayerProps {
  sermons: Sermon[];
  startTime?: number | undefined;
  storageKey?: string;
}

export const Player = ({
  sermons,
  startTime = undefined,
  storageKey = '',
}: PlayerProps) => {
  const player = useRef<MediaPlayerInstance>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (sermons.length < 1) {
    return (
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
        No media available.
      </div>
    );
  }

  const currentSermon = sermons[0];
  const viewType: MediaViewType =
    currentSermon.mediaType.toLowerCase() === 'video' ? 'video' : 'audio';

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const [vttContent, setVttContent] = useState<string | undefined>(undefined);
  const [isLoadingVtt, setIsLoadingVtt] = useState<boolean>(false);

  // We fetch the vtt content so that the lazy loading strategy in the
  // vidstack media player tracks element doesn't starve the vtt data
  // from the MediaSearch, which also needs the vtt data upfront.
  useEffect(() => {
    const vttUrl = currentSermon.vttUrl;
    if (hasContent(vttUrl)) {
      let isCancelled = false;
      setVttContent(undefined);
      setIsLoadingVtt(true);
      console.log('Fetching VTT:', vttUrl);

      // @ts-ignore
      fetch(vttUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP error fetching VTT! status: ${response.status}`,
            );
          }
          return response.text();
        })
        .then((data) => {
          if (!isCancelled) {
            setVttContent(data);
          }
        })
        .catch((error) => {
          if (!isCancelled) {
            console.error('Error fetching VTT:', error);
            setVttContent(undefined);
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setIsLoadingVtt(false);
          }
        });

      return () => {
        isCancelled = true;
        console.log('Cancelling VTT fetch/update');
      };
    } else {
      // No VTT URL provided
      setVttContent(undefined);
      setIsLoadingVtt(false);
    }
  }, [currentSermon.vttUrl]);

  const transitionClasses = 'transition-all duration-300 ease-in-out';

  // Base classes for the MediaPlayer element itself
  const mediaPlayerBaseClasses = `w-full select-none shadow-2xl`;

  // Conditional classes for the MediaPlayer element
  const mediaPlayerViewClasses =
    viewType === 'video'
      ? `aspect-video rounded-xl overflow-hidden`
      : `h-[400px] rounded-xl text-black dark:text-white bg-neutral-200 dark:bg-neutral-600`;

  return (
    <MediaPlayer
      className={`${mediaPlayerBaseClasses} ${mediaPlayerViewClasses} overflow-hidden`}
      title={currentSermon.title}
      src={currentSermon.streamUrl}
      playsInline
      crossOrigin
      viewType={viewType}
      storage={`sermon-index-media-${currentSermon.id}${storageKey}`}
      currentTime={startTime}
      ref={player}
    >
      <Allotment className="custom-media-allotment">
        <Allotment.Pane>
          {/* --- Main Content Area --- */}
          <div
            className={`min-w-0 relative grid grid-cols-1 grid-rows-1 h-full ${transitionClasses}`}
          >
            <MediaProvider
              className={viewType === 'video' ? 'col-start-1 row-start-1' : ''}
            >
              {viewType === 'video' && (
                <Poster
                  className="absolute inset-0 block h-full w-full opacity-0 transition-opacity data-[visible]:opacity-100 object-cover z-0"
                  src={currentSermon.thumbnailUrl}
                  alt={currentSermon.description ?? currentSermon.title}
                />
              )}
              {hasContent(currentSermon.vttUrl) && (
                <Track
                  kind="subtitles"
                  content={vttContent}
                  key={currentSermon.vttUrl}
                  language="en-US"
                  label="English"
                  type="vtt"
                />
              )}
            </MediaProvider>

            {/* CustomLayout (Controls) - Overlays video via grid, sits normally for audio */}
            <CustomLayout
              className={
                viewType === 'video'
                  ? 'col-start-1 row-start-1 z-10'
                  : 'w-full h-full z-10'
              }
              title={currentSermon.title}
              author={currentSermon.contributorFullName}
              authorImageUrl={currentSermon.contributorImageUrl}
              hits={currentSermon.hits}
              isSearchOpen={isSearchOpen}
              toggleSearch={toggleSearch}
            />
          </div>
        </Allotment.Pane>

        {/* --- Search Panel Area --- */}
        <Allotment.Pane
          preferredSize={320}
          minSize={200}
          maxSize={600}
          visible={isSearchOpen}
          snap
        >
          <div
            className={`flex flex-col bg-gray-100 dark:bg-gray-800 shadow-b-xl overflow-hidden h-full`}
            aria-hidden={!isSearchOpen}
          >
            <div className="h-full overflow-y-auto">
              {isSearchOpen && <MediaSearch toggleSearch={toggleSearch} />}
            </div>
          </div>
        </Allotment.Pane>
      </Allotment>
    </MediaPlayer>
  );
};

export interface MiniPlayerProps {
  sermon: Sermon;
  loadStrategy?: MediaLoadingStrategy;
  displayLength?: number;
  onDurationChange?: (duration: number) => void;
}

export const MiniPlayer = ({
  sermon,
  loadStrategy = 'visible',
  displayLength,
  onDurationChange,
}: MiniPlayerProps) => {
  let player = useRef<MediaPlayerInstance>(null);
  const { duration } = useMediaStore(player);

  // Effect to report duration changes back to the parent
  useEffect(() => {
    if (onDurationChange && !isNaN(duration) && duration > 0) {
      onDurationChange(duration);
    }
  }, [duration, onDurationChange]);

  return (
    <>
      <MediaPlayer
        className="w-full items-center select-none overflow-hidden"
        title={sermon.title}
        src={sermon.streamUrl}
        playsInline
        crossOrigin
        viewType={'audio'}
        load={loadStrategy}
        ref={player}
      >
        <MediaProvider />
        <MiniCustomLayout displayLength={displayLength} />
      </MediaPlayer>
    </>
  );
};
