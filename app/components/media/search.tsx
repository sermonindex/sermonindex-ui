import React, { useState, useEffect, useRef } from 'react';
import {
  useMediaPlayer,
  useMediaStore,
  Tooltip,
  type MediaPlayerInstance,
} from '@vidstack/react';
import {
  SearchIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@vidstack/react/icons';
import { VTTCue } from 'media-captions';
import { formatTime } from '~/common/format-number';
import { tooltipClass } from '~/components/media/buttons';

// --- Simple Debounce Hook ---
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

export const MediaSearch = ({ toggleSearch }: MediaSearchProps) => {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const player = useMediaPlayer();
  const { textTracks, textTrack } = useMediaStore(playerRef);

  // --- State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [allCues, setAllCues] = useState<VTTCue[]>([]);
  const [searchResults, setSearchResults] = useState<VTTCue[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState<number>(-1);

  // --- Refs ---
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // --- Debounce Search Term ---
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // --- Effect: Load all cues ---
  useEffect(() => {
    let targetTrack: TextTrack | undefined = undefined;

    // Convert TextTrackList to array to use find()
    const tracksArray = textTracks ? Array.from(textTracks) : [];
    if (tracksArray.length > 0) {
      targetTrack = tracksArray.find((track) => track.kind === 'subtitles');
    } else {
      console.warn('No text tracks found in the list.');
    }

    // Define the function that will load cues into state
    const loadCues = () => {
      // Double-check targetTrack and cues exist when the event fires or when called directly
      if (targetTrack && targetTrack.cues) {
        const cuesArray = Array.from(
          targetTrack.cues as TextTrackCueList<VTTCue>,
        );
        setAllCues(cuesArray);
      } else {
        console.error(
          'loadCues called, but targetTrack or targetTrack.cues not available.',
        );
        setAllCues([]);
      }
      // Reset search state whenever cues are loaded/reloaded
      setSearchTerm('');
      setSearchResults([]);
      setCurrentResultIndex(-1);
    };

    if (targetTrack) {
      // --- Check if track is already loaded ---
      // readyState: 0=NONE, 1=LOADING, 2=LOADED, 3=ERROR
      if (targetTrack.readyState === 2) {
        loadCues();
        // No listener needed, return empty cleanup function
        return () => {};
      } else if (targetTrack.readyState === 1 || targetTrack.readyState === 0) {
        // --- If not loaded, listen for the 'load' event ---
        targetTrack.addEventListener('load', loadCues);

        // --- IMPORTANT: Return a cleanup function ---
        // This removes the listener when the component unmounts
        // or when the `textTracks` dependency changes
        return () => {
          // Check if targetTrack still exists before removing listener
          if (targetTrack) {
            targetTrack.removeEventListener('load', loadCues);
          }
        };
      } else {
        // Handle ERROR state (readyState === 3) or unexpected state
        console.error(
          'Track found but is in error or unexpected state (readyState:',
          targetTrack.readyState,
          '). Not loading cues.',
        );
        setAllCues([]);
        return () => {};
      }
    } else {
      console.warn('No target subtitle track found. Setting cues to empty.');
      // No target track found, ensure cues are empty
      setAllCues([]);
      // Reset search state
      setSearchTerm('');
      setSearchResults([]);
      setCurrentResultIndex(-1);
      // No listener added, so no cleanup needed
      return () => {};
    }

    // --- This effect should re-run if the list of tracks changes ---
  }, [textTracks]);

  // --- Effect: Scroll to active search result ---
  useEffect(() => {
    if (
      currentResultIndex !== -1 &&
      activeItemRef.current &&
      resultsContainerRef.current
    ) {
      // Scroll within the results container
      resultsContainerRef.current.scrollTop =
        activeItemRef.current.offsetTop - resultsContainerRef.current.offsetTop;
    }
  }, [currentResultIndex]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCueClick = (cue: VTTCue) => {
    if (player) {
      player.currentTime = cue.startTime;
    }
  };

  const navigateResults = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;

    let nextIndex = currentResultIndex;
    if (direction === 'next') {
      nextIndex = (currentResultIndex + 1) % searchResults.length;
    } else {
      nextIndex =
        (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    }

    setCurrentResultIndex(nextIndex);
  };

  // --- Effect: Perform Search --- //
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    if (allCues.length > 0) {
      const term = debouncedSearchTerm.toLowerCase();
      const results = allCues.filter((cue) =>
        cue.text.toLowerCase().includes(term),
      );
      setSearchResults(results);
      setCurrentResultIndex(results.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentResultIndex(-1);
    }
  }, [debouncedSearchTerm, allCues]);

  const cuesToDisplay = debouncedSearchTerm.trim() ? searchResults : allCues;
  const showFullTranscript = !debouncedSearchTerm.trim();
  const hasCues = allCues.length > 0;
  const hasResults = searchResults.length > 0;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="sticky top-0 z-10 bg-neutral-200 dark:bg-neutral-600 shadow-md p-2 flex-shrink-0 flex items-center">
        <div
          className={`flex flex-1 items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 w-full shadow-sm border border-gray-200 dark:border-gray-700 transition duration-150 ease-in-out`} // Added flex-1 to allow it to grow
        >
          <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder={
              hasCues ? 'Search this sermon...' : 'No transcript available'
            }
            className={`flex-grow bg-transparent border-none outline-none w-full placeholder:text-gray-500 dark:placeholder-gray-400 text-sm`}
            value={searchTerm}
            onChange={handleInputChange}
            disabled={!hasCues}
          />
        </div>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              onClick={toggleSearch}
              aria-label="Close search panel"
              className="ml-2 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 flex-shrink-0"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content className={tooltipClass} placement="left end">
            Close Search
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
      {!showFullTranscript && hasCues && (
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0 z-10">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {hasResults
              ? `${searchResults.length} occurrence${
                  searchResults.length === 1 ? '' : 's'
                } found`
              : 'No matches'}

            {hasResults &&
              currentResultIndex !== -1 &&
              ` (${currentResultIndex + 1}/${searchResults.length})`}
          </span>
          {hasResults && (
            <div className="flex gap-x-2">
              {/* --- Previous Button --- */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => navigateResults('prev')}
                    aria-label="Previous match"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 pointer-events-auto"
                    disabled={searchResults.length <= 1}
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content className={tooltipClass} placement="top">
                  Previous match
                </Tooltip.Content>
              </Tooltip.Root>

              {/* --- Next Button --- */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => navigateResults('next')}
                    aria-label="Next match"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200"
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
      {/* Results/Transcript Panel - Takes remaining height and scrolls */}
      <div
        ref={resultsContainerRef}
        className="
          overflow-y-auto flex-grow
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
          " // todo: consider using tailwind-scrollbar for scroll bar styling - these styles won't apply to firefox (but it looks good in firefox as is currently)
      >
        {/* Scrollable Cue List */}
        <div>
          {cuesToDisplay.length > 0 ? (
            cuesToDisplay.map((cue, index) => {
              const isCurrentSearchResult =
                !showFullTranscript && index === currentResultIndex;
              const matchesSearchTerm =
                !showFullTranscript &&
                searchTerm.trim() &&
                cue.text
                  .toLowerCase()
                  .includes(searchTerm.trim().toLowerCase());
              const tooltipText = `Seek to ${formatTime(cue.startTime)}`;

              return (
                // todo: I didn't like the title tooltips (felt unmatched to the rest of the media player
                //     and the vidstack Tooltip component is buggy on scroll movement, I didn't like how it looked.
                // <Tooltip.Root key={`${cue.startTime}-${cue.id || index}`}>
                //   {/* 2. Wrap the button with Tooltip.Trigger asChild */}
                //   <Tooltip.Trigger asChild>
                <button
                  // key prop is now on Tooltip.Root
                  ref={isCurrentSearchResult ? activeItemRef : null}
                  onClick={() => handleCueClick(cue)}
                  className={`flex items-center w-full text-left px-3 py-1.5 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-100 ${
                    isCurrentSearchResult
                      ? 'bg-blue-100 dark:bg-blue-800/50 font-semibold'
                      : ''
                  } ${
                    matchesSearchTerm && !isCurrentSearchResult
                      ? 'bg-yellow-100 dark:bg-yellow-700/30'
                      : ''
                  }`}
                  // title={tooltipText}  -- see my todo above
                >
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400 mr-1 w-12 shrink-0">
                    {formatTime(cue.startTime)}
                  </span>
                  <span
                    className="text-gray-800 dark:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: cue.text }}
                  />
                </button>
                //   </Tooltip.Trigger>
                //   {/* 4. Add Tooltip.Content with styling and text */}
                //   <Tooltip.Content className={tooltipClass} placement="top">
                //     {tooltipText}
                //   </Tooltip.Content>
                // </Tooltip.Root>
              );
            })
          ) : (
            <p className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              {showFullTranscript
                ? 'Loading transcript or transcript empty.'
                : 'No matching cues found.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
