import './base.css';

import {
  MediaErrorDetail,
  MediaErrorEvent,
  MediaLoadingStrategy,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaSourceChangeEvent,
  MediaViewType,
  Poster,
  Src,
  Track,
  useMediaStore,
} from '@vidstack/react';
import { useEffect, useRef, useState } from 'react';
import { MediaType, Sermon } from '~/api/interfaces';
import { hasContent } from '~/common/sanitize';
import { CustomLayout, MiniCustomLayout } from '~/components/media/layout';
import { MediaSearch } from '~/components/media/search';

import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { getMediaFallbackUrl } from '~/common/hacky';
import { SermonPlaylist } from '~/components/media/playlist';

export interface PlayerProps {
  sermons: Sermon[];
  storageKey?: string;
  showAuthorImage?: boolean;
}

export const Player = ({
  sermons,
  storageKey = '',
  showAuthorImage = false,
}: PlayerProps) => {
  const player = useRef<MediaPlayerInstance>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorDetail, setErrorDetail] = useState<MediaErrorDetail | null>(null);
  const [shuffle, setShuffleState] = useState<'off' | 'on'>('off');
  const [repeat, setRepeatState] = useState<
    'none' | 'repeat-all' | 'repeat-one'
  >('none');
  const [hasAttemptedFallback, setHasAttemptedFallback] = useState(false);
  const hasPlaybackStarted = useRef(false);

  if (sermons.length < 1) {
    return (
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 sm:rounded-xl flex items-center justify-center text-gray-500">
        No media available.
      </div>
    );
  }

  const currentSermon = sermons[currentIndex];
  const isPlaylistMode = sermons.length > 1;
  const [currentSrc, setCurrentSrc] = useState(currentSermon.streamUrl);

  const viewType: MediaViewType =
    currentSermon.mediaType === MediaType.Video ? 'video' : 'audio';

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const [vttContent, setVttContent] = useState<string | undefined>(undefined);
  const [isLoadingVtt, setIsLoadingVtt] = useState<boolean>(false);

  useEffect(() => {
    const newSermon = sermons[currentIndex];
    const newSrc = newSermon.streamUrl;

    setCurrentSrc(newSermon.streamUrl);
    setErrorDetail(null);
    setHasAttemptedFallback(false);

    if (player.current) {
      player.current.src = newSrc;
    }
  }, [currentIndex, sermons]);

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

  const incrementSermonList = (loop: boolean) => {
    if (loop && currentIndex === sermons.length - 1) {
      if (currentIndex < sermons.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }
    if (currentIndex < sermons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const shuffleIndex = () => {
    const randomIndex = Math.floor(Math.random() * sermons.length);
    setCurrentIndex(randomIndex);
  };

  const handleNextSermon = () => {
    console.log(repeat, shuffle);
    switch (repeat) {
      case 'repeat-one':
        player.current?.play();
        return;
      case 'repeat-all':
        if (shuffle === 'on') {
          shuffleIndex();
          return;
        } else {
          incrementSermonList(true);
          return;
        }
      default:
        break;
    }

    switch (shuffle) {
      case 'on':
        shuffleIndex();
        return;
      default:
        break;
    }

    incrementSermonList(false);
  };

  const handlePreviousSermon = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePlaylistItemClick = (index: number) => {
    if (index !== currentIndex) {
      if (!hasPlaybackStarted.current) {
        hasPlaybackStarted.current = true;
      }
      setCurrentIndex(index);
    }
  };

  const handlePlay = () => {
    if (!hasPlaybackStarted.current) {
      hasPlaybackStarted.current = true;
    }
  };

  const handleCanPlay = () => {
    if (hasPlaybackStarted.current) {
      player.current?.play();
    }
  };

  const handleError = (
    detail: MediaErrorDetail,
    nativeEvent: MediaErrorEvent,
  ) => {
    setErrorDetail(detail);

    // This is a hack, where, if we fail to load we check if this is from
    // and archive.org src and try to infer the bunny cdn url
    if (!hasAttemptedFallback && player.current) {
      console.log('Original source failed. Attempting fallback...');
      const originalUrl = currentSermon.streamUrl;
      const fallbackUrl = getMediaFallbackUrl(originalUrl);

      if (fallbackUrl) {
        console.log('Generated fallback URL:', fallbackUrl);
        setHasAttemptedFallback(true);
        setCurrentSrc(fallbackUrl);
      } else {
        console.log('Could not generate a fallback URL.');
      }
    }
  };

  const handleSourceChange = (
    src: Src<unknown>,
    nativeEvent: MediaSourceChangeEvent,
  ) => {
    setErrorDetail(null);
  };

  const transitionClasses = 'transition-all duration-300 ease-in-out';
  const mediaPlayerBaseClasses = `w-full select-none`;
  const mediaPlayerViewClasses =
    viewType === 'video'
      ? `aspect-video`
      : `${
          isPlaylistMode ? 'h-[250px]' : 'h-[300px]'
        } text-black dark:text-white bg-neutral-200 dark:bg-neutral-600`;

  return (
    <div className="sm:py-4 md:py-6 sm:px-8 ">
      <div
        className={`${
          isPlaylistMode ? 'sm:rounded-xl shadow-2xl overflow-hidden' : ''
        }`}
      >
        <MediaPlayer
          className={`${mediaPlayerBaseClasses} ${mediaPlayerViewClasses} ${
            isPlaylistMode ? '' : 'sm:rounded-xl shadow-2xl overflow-hidden'
          }`}
          title={currentSermon.title}
          src={currentSrc}
          playsInline
          crossOrigin
          viewType={viewType}
          load={isPlaylistMode ? 'eager' : 'visible'}
          storage={
            isPlaylistMode
              ? undefined
              : `sermon-index-media-${currentSermon.id}${storageKey}`
          }
          ref={player}
          onEnded={handleNextSermon}
          onPlay={handlePlay}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onSourceChange={handleSourceChange}
        >
          <Allotment className="custom-media-allotment">
            <Allotment.Pane>
              <div
                className={`min-w-0 relative grid grid-cols-1 grid-rows-1 h-full ${transitionClasses}`}
              >
                <MediaProvider
                  className={
                    viewType === 'video' ? 'col-start-1 row-start-1' : ''
                  }
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

                <CustomLayout
                  className={
                    viewType === 'video'
                      ? 'col-start-1 row-start-1 z-10'
                      : 'w-full h-full z-10 media-fullscreen:bg-black'
                  }
                  title={currentSermon.title}
                  author={currentSermon.contributorFullName}
                  authorImageUrl={
                    showAuthorImage
                      ? currentSermon.contributorImageUrl
                      : undefined
                  }
                  hits={currentSermon.views}
                  isSearchOpen={isSearchOpen}
                  toggleSearch={toggleSearch}
                  isPlaylistMode={isPlaylistMode}
                  errorDetail={errorDetail}
                  nextCallback={handleNextSermon}
                  prevCallback={handlePreviousSermon}
                  downloadUrl={currentSermon.downloadUrl}
                  shuffleState={shuffle}
                  onShuffleStateChange={setShuffleState}
                  repeatState={repeat}
                  onRepeatStateChange={setRepeatState}
                />
              </div>
            </Allotment.Pane>

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
        {isPlaylistMode && (
          <SermonPlaylist
            sermons={sermons}
            currentIndex={currentIndex}
            onPlaylistItemClick={handlePlaylistItemClick}
          />
        )}
      </div>
    </div>
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
