import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  useMediaPlayer,
  useMediaStore,
  Tooltip,
  type MediaPlayerInstance,
} from '@vidstack/react';
import {
  SearchIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@vidstack/react/icons';
import { VTTCue } from 'media-captions';
import { formatTime } from '~/common/format-number';
import { tooltipClass } from '~/components/media/buttons';
import { SiButton } from '~/components/button';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface MediaSearchProps {
  toggleSearch: () => void;
}

interface SearchResultItem {
  cue: VTTCue;
  originalIndex: number;
}

function areCueArraysEffectivelyEqual(arr1: VTTCue[], arr2: VTTCue[]): boolean {
  if (!arr1 && !arr2) return true;
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (
      arr1[i].startTime !== arr2[i].startTime ||
      arr1[i].endTime !== arr2[i].endTime ||
      arr1[i].text !== arr2[i].text
    ) {
      return false;
    }
  }
  return true;
}

export const MediaSearch = ({ toggleSearch }: MediaSearchProps) => {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const player = useMediaPlayer();
  // @ts-ignore
  const { textTracks, currentTime } = useMediaStore(playerRef, [
    'textTracks',
    'currentTime',
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const searchTermRef = useRef(searchTerm);
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  const [allCues, setAllCues] = useState<VTTCue[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState<number>(-1);
  const [currentPlayingCueIndex, setCurrentPlayingCueIndex] =
    useState<number>(-1);

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const userHasManuallyScrolledRef = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const [isCurrentCueInView, setIsCurrentCueInView] = useState(true);
  const [determinedJumpButtonIcon, setDeterminedJumpButtonIcon] = useState(
    () => ArrowUpIcon,
  );

  const isProgrammaticScrollRef = useRef(false);
  // this timeout is for determining the *end* of a programmatic scroll
  const endProgrammaticScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const showFullTranscriptForDisplay = !searchTerm.trim();

  const findCurrentCueIndex = useCallback(
    (time: number): number => {
      if (!allCues || allCues.length === 0) return -1;
      for (let i = 0; i < allCues.length; i++) {
        if (allCues[i].startTime <= time) {
          if (i === allCues.length - 1 || allCues[i + 1].startTime > time) {
            return i;
          }
        } else {
          break;
        }
      }
      return -1;
    },
    [allCues],
  );

  const checkAndUpdateCueAndButtonState = useCallback(() => {
    const isEffectivelyInFullTranscriptView = !debouncedSearchTerm.trim();
    let cueIsVisible = true;
    let iconType = ArrowUpIcon;

    if (
      isEffectivelyInFullTranscriptView &&
      resultsContainerRef.current &&
      currentPlayingCueIndex >= 0 &&
      allCues.length > 0
    ) {
      const container = resultsContainerRef.current;
      const cueElement = container.querySelector(
        `[data-cue-index="${currentPlayingCueIndex}"]`,
      ) as HTMLElement;
      if (cueElement) {
        const containerRect = container.getBoundingClientRect();
        const cueRect = cueElement.getBoundingClientRect();
        if (
          cueRect.bottom <= containerRect.top ||
          cueRect.top >= containerRect.bottom
        ) {
          cueIsVisible = false;
          const cueCenterY = cueRect.top + cueRect.height / 2;
          const containerCenterY = containerRect.top + containerRect.height / 2;
          if (
            cueRect.top >= containerRect.bottom ||
            (cueRect.top > containerRect.top &&
              cueCenterY > containerCenterY + 1)
          ) {
            iconType = ArrowDownIcon;
          } else {
            iconType = ArrowUpIcon;
          }
        }
      } else {
        cueIsVisible = false;
      }
    } else {
      cueIsVisible = false;
    }

    setIsCurrentCueInView((prev) =>
      prev !== cueIsVisible ? cueIsVisible : prev,
    );
    if (!cueIsVisible) {
      setDeterminedJumpButtonIcon((prevIcon) =>
        prevIcon !== iconType ? iconType : prevIcon,
      );
    } else {
      setDeterminedJumpButtonIcon(ArrowUpIcon);
    }
  }, [debouncedSearchTerm, currentPlayingCueIndex, allCues.length]);

  useEffect(() => {
    // Load Cues
    let targetTrack: TextTrack | undefined = undefined;
    const tracksArray = textTracks ? Array.from(textTracks) : [];
    if (tracksArray.length > 0)
      targetTrack = tracksArray.find((track) => track.kind === 'subtitles');

    const processCuesFromTrack = (track: TextTrack | null) => {
      const newCuesArray: VTTCue[] =
        track && track.cues
          ? Array.from(track.cues as TextTrackCueList<VTTCue>)
          : [];
      setAllCues((prevAllCues) => {
        if (!areCueArraysEffectivelyEqual(newCuesArray, prevAllCues)) {
          setCurrentPlayingCueIndex(-1);
          setSearchResults([]);
          setCurrentResultIndex(-1);
          setIsAutoScrolling(true);
          userHasManuallyScrolledRef.current = false;
          if (newCuesArray.length === 0 && prevAllCues.length > 0)
            setSearchTerm('');
          else if (!searchTermRef.current) setSearchTerm('');
          return newCuesArray;
        }
        return prevAllCues;
      });
    };

    if (targetTrack) {
      if (targetTrack.readyState === 2) processCuesFromTrack(targetTrack);
      else if (targetTrack.readyState === 1 || targetTrack.readyState === 0) {
        const loadHandler = () => {
          processCuesFromTrack(targetTrack);
          targetTrack?.removeEventListener('load', loadHandler);
        };
        targetTrack.addEventListener('load', loadHandler);
        return () => {
          targetTrack?.removeEventListener('load', loadHandler);
        };
      } else {
        processCuesFromTrack(null);
      }
    } else {
      processCuesFromTrack(null);
    }
  }, [textTracks]);

  useEffect(() => {
    // Update currentPlayingCueIndex
    if (debouncedSearchTerm.trim()) {
      setCurrentPlayingCueIndex((prevIndex) =>
        prevIndex !== -1 ? -1 : prevIndex,
      );
    } else {
      const newIndex = findCurrentCueIndex(currentTime);
      setCurrentPlayingCueIndex((prevIndex) =>
        newIndex !== prevIndex ? newIndex : prevIndex,
      );
    }
  }, [currentTime, debouncedSearchTerm, findCurrentCueIndex]);

  useEffect(() => {
    // Perform Search
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }
    if (allCues.length > 0) {
      const term = debouncedSearchTerm.toLowerCase();
      const results: SearchResultItem[] = allCues
        .map((cue, index) => ({ cue, originalIndex: index }))
        .filter((item) => item.cue.text.toLowerCase().includes(term));
      setSearchResults(results);
      setCurrentResultIndex(results.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentResultIndex(-1);
    }
  }, [debouncedSearchTerm, allCues]);

  // scrollToCue and its interaction with handleScroll
  const scrollToCue = useCallback(
    (indexInAllCues: number, behavior: ScrollBehavior = 'smooth') => {
      if (indexInAllCues < 0 || !resultsContainerRef.current) return;
      const cueElement = resultsContainerRef.current.querySelector(
        `[data-cue-index="${indexInAllCues}"]`,
      ) as HTMLElement;

      if (cueElement) {
        isProgrammaticScrollRef.current = true; // Signal that a programmatic scroll is starting
        if (endProgrammaticScrollTimeoutRef.current) {
          clearTimeout(endProgrammaticScrollTimeoutRef.current);
        }

        cueElement.scrollIntoView({
          behavior,
          block: 'center',
          inline: 'nearest',
        });

        // This timeout will mark the programmatic scroll as "finished" if no further scroll events refresh it.
        // The duration is how long we wait *after the last detected scroll event from this action*
        // before considering the programmatic scroll to be over.
        const quietPeriodAfterScrollEvents = 150; // ms
        endProgrammaticScrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
          checkAndUpdateCueAndButtonState();
        }, quietPeriodAfterScrollEvents);
      }
    },
    [checkAndUpdateCueAndButtonState],
  );

  useEffect(() => {
    // Cleanup for the programmatic scroll timeout
    return () => {
      if (endProgrammaticScrollTimeoutRef.current) {
        clearTimeout(endProgrammaticScrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to active search result
    if (
      !showFullTranscriptForDisplay &&
      currentResultIndex !== -1 &&
      searchResults.length > 0 &&
      searchResults[currentResultIndex]
    ) {
      const timer = setTimeout(() => {
        if (activeItemRef.current) {
          activeItemRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentResultIndex, searchResults, showFullTranscriptForDisplay]);

  useEffect(() => {
    // Autoscroll Effect
    if (
      isAutoScrolling &&
      !userHasManuallyScrolledRef.current &&
      !searchTerm.trim() &&
      currentPlayingCueIndex >= 0
    ) {
      scrollToCue(currentPlayingCueIndex, 'smooth');
    }
  }, [isAutoScrolling, searchTerm, currentPlayingCueIndex, scrollToCue]);

  useEffect(() => {
    // Update jump button state based on its dependencies
    checkAndUpdateCueAndButtonState();
  }, [checkAndUpdateCueAndButtonState]);

  // handle manual scroll
  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) {
      // If this scroll event is part of an ongoing programmatic scroll,
      // refresh the timeout. This keeps the programmatic flag true as long as events are firing.
      if (endProgrammaticScrollTimeoutRef.current) {
        clearTimeout(endProgrammaticScrollTimeoutRef.current);
      }
      const quietPeriodAfterScrollEvents = 150; // ms
      endProgrammaticScrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        checkAndUpdateCueAndButtonState();
      }, quietPeriodAfterScrollEvents);
      return; // Ignore this scroll event for user interaction purposes
    }

    // If we reach here, it's a user scroll
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }
    userHasManuallyScrolledRef.current = true;
    checkAndUpdateCueAndButtonState();
  }, [isAutoScrolling, checkAndUpdateCueAndButtonState]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value;
      setSearchTerm(newSearchTerm);
      if (newSearchTerm.trim()) {
        if (isAutoScrolling) setIsAutoScrolling(false);
      } else {
        if (!userHasManuallyScrolledRef.current) setIsAutoScrolling(true);
      }
    },
    [isAutoScrolling],
  );

  const handleCueClick = useCallback(
    (clickedCue: VTTCue) => {
      if (player) player.currentTime = clickedCue.startTime;
      const indexInAllCues = allCues.findIndex(
        (c) =>
          c.startTime === clickedCue.startTime && c.text === clickedCue.text,
      );
      if (indexInAllCues !== -1) setCurrentPlayingCueIndex(indexInAllCues);
      if (searchTermRef.current) setSearchTerm('');
      setIsAutoScrolling(true);
      userHasManuallyScrolledRef.current = false;
    },
    [player, allCues],
  );

  const navigateResults = useCallback(
    (direction: 'next' | 'prev') => {
      if (searchResults.length === 0) return;
      let nextIndex = currentResultIndex;
      if (direction === 'next')
        nextIndex = (currentResultIndex + 1) % searchResults.length;
      else
        nextIndex =
          (currentResultIndex - 1 + searchResults.length) %
          searchResults.length;
      setCurrentResultIndex(nextIndex);
    },
    [searchResults, currentResultIndex],
  );

  const handleJumpToCurrent = useCallback(() => {
    if (currentPlayingCueIndex >= 0) {
      scrollToCue(currentPlayingCueIndex, 'smooth');
      setIsAutoScrolling(true);
      userHasManuallyScrolledRef.current = false;
    }
  }, [currentPlayingCueIndex, scrollToCue]);

  const itemsToDisplay = showFullTranscriptForDisplay ? allCues : searchResults;
  const hasCues = allCues.length > 0;

  const showJumpButton =
    !isCurrentCueInView &&
    !isAutoScrolling &&
    !debouncedSearchTerm.trim() &&
    hasCues;
  const JumpButtonIconToDisplay = determinedJumpButtonIcon;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden media-fullscreen:bg-black/90">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-neutral-200 dark:bg-neutral-600 media-fullscreen:bg-neutral-600 shadow-md p-2 flex-shrink-0 flex items-center">
        <div className="flex flex-1 items-center bg-white dark:bg-gray-800 media-fullscreen:bg-gray-800 rounded-full px-4 py-2 w-full shadow-sm border border-gray-200 dark:border-gray-700 media-fullscreen:border-gray-700 transition duration-150 ease-in-out">
          <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 media-fullscreen:text-gray-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder={
              hasCues ? 'Search transcript...' : 'No transcript available'
            }
            className="flex-grow bg-transparent border-none outline-none w-full placeholder:text-gray-500 dark:placeholder-gray-400 media-fullscreen:placeholder-gray-400 text-sm"
            value={searchTerm}
            onChange={handleInputChange}
            disabled={!hasCues}
          />
        </div>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <SiButton
              type="button"
              onClick={toggleSearch}
              aria-label="Close search panel"
              className="ml-2 p-1 rounded-full text-gray-500 dark:text-gray-400 media-fullscreen:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 media-fullscreen:hover:bg-gray-700 flex-shrink-0"
            >
              <XMarkIcon className="w-5 h-5" />
            </SiButton>
          </Tooltip.Trigger>
          <Tooltip.Content className={tooltipClass} placement="left end">
            Close Search
          </Tooltip.Content>
        </Tooltip.Root>
      </div>

      {/* Search Results Info */}
      {!showFullTranscriptForDisplay && hasCues && (
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 media-fullscreen:border-gray-700 bg-gray-50 dark:bg-gray-700 media-fullscreen:bg-gray-700 flex-shrink-0 z-10">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 media-fullscreen:text-gray-300">
            {searchResults.length > 0
              ? `${searchResults.length} occurrence${
                  searchResults.length === 1 ? '' : 's'
                } found`
              : 'No matches'}
            {searchResults.length > 0 &&
              currentResultIndex !== -1 &&
              ` (${currentResultIndex + 1}/${searchResults.length})`}
          </span>
          {searchResults.length > 0 && (
            <div className="flex gap-x-2">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => navigateResults('prev')}
                    aria-label="Previous match"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 media-fullscreen:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 media-fullscreen:text-gray-200"
                    disabled={searchResults.length <= 1}
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top">
                  Previous match
                </Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => navigateResults('next')}
                    aria-label="Next match"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 media-fullscreen:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 media-fullscreen:text-gray-200"
                    disabled={searchResults.length <= 1}
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top">
                  Next match
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          )}
        </div>
      )}

      {/* Results/Transcript Panel */}
      <div
        ref={resultsContainerRef}
        onScroll={handleScroll}
        className="overflow-y-auto flex-grow
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
        dark:[&::-webkit-scrollbar-track]:bg-transparent
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
        dark:[&::-webkit-scrollbar-thumb:hover]:bg-neutral-400
        media-fullscreen:[&::-webkit-scrollbar-track]:bg-transparent
        media-fullscreen:[&::-webkit-scrollbar-track]:bg-neutral-700
        media-fullscreen:[&::-webkit-scrollbar-thumb]:bg-neutral-500
        media-fullscreen:[&::-webkit-scrollbar-thumb:hover]:bg-neutral-400"
      >
        <div>
          {itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((itemData, loopIndex) => {
              const currentCue: VTTCue = showFullTranscriptForDisplay
                ? (itemData as VTTCue)
                : (itemData as SearchResultItem).cue;
              const dataIndexForScroll: number = showFullTranscriptForDisplay
                ? loopIndex
                : (itemData as SearchResultItem).originalIndex;

              const isCurrentLiveCue =
                showFullTranscriptForDisplay &&
                dataIndexForScroll === currentPlayingCueIndex;
              const isActiveSearchResult =
                !showFullTranscriptForDisplay &&
                loopIndex === currentResultIndex;

              let highlightClass = '';
              if (isCurrentLiveCue) {
                highlightClass =
                  'bg-si-olive/20 dark:bg-si-main/30 media-fullscreen:bg-si-main/30';
              } else if (isActiveSearchResult) {
                highlightClass =
                  'bg-emerald-100 dark:bg-emerald-800/50 media-fullscreen:bg-emerald-800/50 font-semibold';
              }

              return (
                <button
                  key={`${currentCue.startTime}-${
                    currentCue.id || dataIndexForScroll
                  }`}
                  ref={isActiveSearchResult ? activeItemRef : null}
                  data-cue-index={dataIndexForScroll}
                  onClick={() => handleCueClick(currentCue)}
                  className={`flex items-start w-full text-left px-3 py-1.5 gap-x-2 text-sm hover:bg-gray-200/50 dark:hover:bg-white/10 media-fullscreen:hover:bg-white/10 transition-colors duration-100 ${highlightClass}`}
                >
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400 media-fullscreen:text-gray-400 mr-2 pt-0.5 w-12 shrink-0">
                    {formatTime(currentCue.startTime)}
                  </span>
                  <span
                    className="text-gray-800 dark:text-gray-100 media-fullscreen:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: currentCue.text }}
                  />
                </button>
              );
            })
          ) : (
            <p className="p-3 text-sm text-gray-500 dark:text-gray-400 media-fullscreen:text-gray-400 text-center">
              {showFullTranscriptForDisplay
                ? hasCues
                  ? 'Loading transcript...'
                  : 'Transcript empty or unavailable.'
                : 'No matching cues found.'}
            </p>
          )}
        </div>
        {/* Show jump button */}
        {showJumpButton && (
          <div className="sticky bottom-4 transform z-20 w-auto flex justify-center">
            <button
              onClick={handleJumpToCurrent}
              aria-label="Follow Transcript"
              className="flex items-center gap-x-1.5 px-3 py-1.5 bg-si-olive hover:bg-si-main text-white rounded-full shadow-lg text-sm font-medium transition-colors duration-150"
            >
              <JumpButtonIconToDisplay className="w-3.5 h-3.5" />
              Follow Transcript
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
