import React, { useState, useEffect, useRef } from 'react';
import {
  useMediaState,
  useActiveTextTrack,
  useActiveTextCues,
  isTrackCaptionKind,
} from '@vidstack/react';
import { VTTCue } from 'media-captions';

// --- Component Props Interface ---
interface CustomCaptionDisplayProps {
  /** Number of previous cues to display */
  numPrev?: number;
  /** Number of next cues to display */
  numNext?: number;
  /** The vertical distance (in CSS units like 'em', 'px') each cue shifts. Controls spacing. */
  lineHeight?: string; // <-- Controls spacing
  /** Base font size for cues (CSS unit) */
  fontSize?: string;
  textColor?: string;
}

export function CustomCaptionDisplay({
  numPrev = 1,
  numNext = 1,
  // --- Reduced default line height for tighter spacing ---
  lineHeight = '1rem', // <-- Default reduced from 1.4em
  fontSize = '1rem',
  textColor = 'text-white',
}: CustomCaptionDisplayProps) {
  // --- Media State Hooks ---
  const selectedTrack = useMediaState('textTrack');
  const captionsEnabled = !!(
    selectedTrack && isTrackCaptionKind(selectedTrack)
  );
  const activeSubtitlesTrack = useActiveTextTrack('subtitles');
  const activeCues = useActiveTextCues(activeSubtitlesTrack);

  // --- State ---
  const [displayCues, setDisplayCues] = useState<VTTCue[]>([]);
  const [currentActiveCue, setCurrentActiveCue] = useState<VTTCue | null>(null);

  // --- Refs ---
  const allCuesRef = useRef<VTTCue[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Effect: Load all cues when the track changes ---
  useEffect(() => {
    allCuesRef.current = Array.from(activeSubtitlesTrack?.cues ?? []);
    // Reset display only if the track itself changes
    // Avoid clearing here based on activeCues, handle persistence below
    if (!activeSubtitlesTrack) {
      setDisplayCues([]);
      setCurrentActiveCue(null);
    }
    // We might still want to reset if the *content* of the track changes
    // but the reference stays the same. This basic check covers track switching.
  }, [activeSubtitlesTrack]);

  // --- Effect: Update displayed cue window based on active cues & captions enabled ---
  useEffect(() => {
    // --- Step 1: Handle captions being turned OFF ---
    // If captions are globally disabled, always clear the display.
    if (!captionsEnabled) {
      // Only clear state if it's not already cleared to prevent loops
      if (displayCues.length > 0 || currentActiveCue) {
        setDisplayCues([]);
        setCurrentActiveCue(null);
      }
      return; // Stop processing
    }

    // --- Step 2: Handle captions being ON ---
    // Get the first *currently* active cue based on time
    const newTimeActiveCue = activeCues?.[0] || null;

    // --- Step 3: Update display ONLY if a NEW cue becomes active ---
    // Check if there IS a new time-active cue AND if it's DIFFERENT
    // from the one we are currently displaying as 'active'.
    if (newTimeActiveCue) {
      const hasActiveCueChanged =
        newTimeActiveCue.startTime !== currentActiveCue?.startTime ||
        newTimeActiveCue.endTime !== currentActiveCue?.endTime ||
        newTimeActiveCue.text !== currentActiveCue?.text;

      if (hasActiveCueChanged) {
        // A new, different cue is active! Update the state.
        setCurrentActiveCue(newTimeActiveCue); // Track the new active cue

        if (allCuesRef.current.length > 0) {
          const currentIndex = allCuesRef.current.findIndex(
            (cue) =>
              cue.startTime === newTimeActiveCue.startTime &&
              cue.endTime === newTimeActiveCue.endTime &&
              cue.text === newTimeActiveCue.text,
          );

          if (currentIndex !== -1) {
            const startIndex = Math.max(0, currentIndex - numPrev);
            const endIndex = Math.min(
              allCuesRef.current.length,
              currentIndex + 1 + numNext,
            );
            const newDisplayWindow = allCuesRef.current.slice(
              startIndex,
              endIndex,
            );
            setDisplayCues(newDisplayWindow);
          } else {
            console.warn("Active cue not found in track's cue list.");
            setDisplayCues([newTimeActiveCue]); // Fallback: Show only the active one
          }
        } else {
          // Cue list not loaded yet, maybe show just the active one?
          setDisplayCues([newTimeActiveCue]);
        }
      }
      // else: The time-active cue is the same one we already have as current. Do nothing.
    }
    // --- Step 4: Handle gaps (newTimeActiveCue is null) ---
    // If newTimeActiveCue is null (a gap between cues), we explicitly DO NOTHING.
    // This leaves `currentActiveCue` and `displayCues` showing the *last* active cue window.

    // Dependencies: React to changes in time-based active cues, the overall enabled state,
    // the current cue we are tracking, and the display parameters.
  }, [activeCues, captionsEnabled, currentActiveCue, numPrev, numNext]);

  // --- Calculate Styling ---
  // Display should be visible if captions are enabled AND we have a cue window to show
  const shouldShowCaptions = captionsEnabled && displayCues.length > 0;

  // Find the index of the *current* active cue within the *displayed* window
  // Use currentActiveCue (which persists during gaps) for positioning.
  const activeIndexInWindow = currentActiveCue
    ? displayCues.findIndex(
        (cue) =>
          cue.startTime === currentActiveCue.startTime &&
          cue.endTime === currentActiveCue.endTime &&
          cue.text === currentActiveCue.text,
      )
    : -1;

  // --- Render ---
  return (
    <div
      ref={containerRef}
      className={`custom-caption-container w-auto flex justify-center pointer-events-none transition-opacity duration-300 ${
        // w-auto allows parent to control width
        shouldShowCaptions ? 'opacity-100' : 'opacity-0'
      }`}
      style={
        {
          '--cue-line-height': lineHeight,
          '--cue-font-size': fontSize,
        } as React.CSSProperties
      }
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="relative flex flex-col items-center"
        style={{
          // Adjusted multiplier slightly for potentially tighter lines
          maxHeight: `calc(${
            numPrev + 1 + numNext
          } * var(--cue-line-height) * 1.1)`,
        }}
      >
        {/* Only render cues if activeIndexInWindow is valid (meaning currentActiveCue is in displayCues) */}
        {activeIndexInWindow !== -1 &&
          displayCues.map((cue, index) => {
            const isCurrent = cue === currentActiveCue;
            const relativePosition = index - activeIndexInWindow;

            let opacity = 0;
            if (isCurrent) {
              opacity = 1;
            } else {
              const distance = Math.abs(relativePosition);
              // Slightly increase fade-out for potentially more lines displayed closely
              opacity = Math.max(0, 1 - distance * 0.35);
            }

            const cueKey = `${cue.startTime}-${cue.text}`;

            return (
              <p
                key={cueKey}
                className={`cue-item text-center select-none break-words transition-all duration-500 ease-in-out ${textColor}`}
                style={{
                  fontSize: 'var(--cue-font-size)',
                  // Using CSS var for line height directly affects spacing
                  lineHeight: 'var(--cue-line-height)',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  opacity: opacity,
                  transform: `translateY(calc(${relativePosition} * var(--cue-line-height)))`,
                }}
                dangerouslySetInnerHTML={{ __html: cue.text }}
              />
            );
          })}
      </div>
    </div>
  );
}

export function VideoCaptions() {
  const track = useMediaState('textTrack');
  // Check if a track is selected AND it's specifically a caption/subtitle track
  const captionsAreOn = track && isTrackCaptionKind(track);

  // If captions are not on, render nothing - this completely removes the div
  if (!captionsAreOn) {
    return null;
  }

  return (
    <div
      className="
            absolute bottom-0 left-0 right-0
            justify-center
            pointer-events-none
            z-9
            p-4
            transition-[padding] duration-300
            media-controls:pb-[200px]
            media-preview:opacity-0
            bg-black/20
            rounded-b-xl
          "
      aria-hidden="true" // Hide decorative wrapper from accessibility tree
    >
      <CustomCaptionDisplay
        numPrev={4}
        numNext={4}
        lineHeight="1em"
        fontSize="0.9rem"
        textColor="text-white"
      />
    </div>
  );
}

export function AudioCaptions() {
  const track = useMediaState('textTrack');
  // Check if a track is selected AND it's specifically a caption/subtitle track
  const captionsAreOn = track && isTrackCaptionKind(track);

  // If captions are not on, render nothing - this completely removes the div
  if (!captionsAreOn) {
    return null;
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[110%]">
      <CustomCaptionDisplay
        numPrev={1}
        numNext={1}
        lineHeight="0.75em"
        fontSize="1.0rem"
        textColor="text-black dark:text-white media-fullscreen:text-white"
      />
    </div>
  );
}
