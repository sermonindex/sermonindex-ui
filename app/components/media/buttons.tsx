import {
  CaptionButton,
  FullscreenButton,
  isTrackCaptionKind,
  MuteButton,
  PIPButton,
  PlayButton,
  Tooltip,
  useMediaState,
  type TooltipPlacement,
  SeekButton,
  GoogleCastButton,
} from '@vidstack/react';
import {
  ChromecastIcon,
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  MuteIcon,
  NextIcon,
  PauseIcon,
  PictureInPictureExitIcon,
  PictureInPictureIcon,
  PlayIcon,
  PreviousIcon,
  ReplayIcon,
  SearchIcon,
  SeekBackward10Icon,
  SeekForward10Icon,
  ShareArrowIcon,
  ShareIcon,
  VolumeHighIcon,
  VolumeLowIcon,
} from '@vidstack/react/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@remix-run/react';

export interface MediaButtonProps {
  tooltipPlacement: TooltipPlacement;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

enum MediaButtonSize {
  sm = 4,
  md = 8,
  lg = 14,
  xl = 20,
}

function getButtonSize(size: 'sm' | 'md' | 'lg' | 'xl'): string {
  const s = MediaButtonSize[size] as number;
  return `h-${s} w-${s}`;
}

export const buttonClass =
  'group ring-media-focus relative inline-flex cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4';

export const tooltipClass =
  'animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-30 rounded-full bg-black/5 dark:bg-black/30 backdrop-blur-sm px-2 py-px text-sm font-medium parent-data-[open]:hidden';

export function Play({ tooltipPlacement, size = 'lg' }: MediaButtonProps) {
  const isPaused = useMediaState('paused');
  const isEnded = useMediaState('ended');

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className={`${buttonClass} ${getButtonSize(size)}`}>
          {isPaused ? isEnded ? <ReplayIcon /> : <PlayIcon /> : <PauseIcon />}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isEnded ? 'Replay' : isPaused ? 'Play' : 'Pause'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Mute({ tooltipPlacement, size = 'md' }: MediaButtonProps) {
  const volume = useMediaState('volume'),
    isMuted = useMediaState('muted');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className={`${buttonClass} ${getButtonSize(size)}`}>
          {isMuted || volume == 0 ? (
            <MuteIcon />
          ) : volume < 0.5 ? (
            <VolumeLowIcon />
          ) : (
            <VolumeHighIcon />
          )}
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isMuted ? 'Unmute' : 'Mute'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Caption({ tooltipPlacement, size = 'md' }: MediaButtonProps) {
  const track = useMediaState('textTrack'),
    isOn = track && isTrackCaptionKind(track),
    hasCaptions = useMediaState('hasCaptions');

  if (!hasCaptions) {
    return null;
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className={`${buttonClass} ${getButtonSize(size)}`}>
          {isOn ? <ClosedCaptionsOnIcon /> : <ClosedCaptionsIcon />}
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isOn ? 'Closed-Captions Off' : 'Closed-Captions On'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PIP({ tooltipPlacement, size = 'md' }: MediaButtonProps) {
  const isActive = useMediaState('pictureInPicture');
  const canPip = useMediaState('canPictureInPicture');

  if (!canPip) {
    return null;
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className={`${buttonClass} ${getButtonSize(size)}`}>
          {isActive ? <PictureInPictureExitIcon /> : <PictureInPictureIcon />}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? 'Exit PIP' : 'Enter PIP'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Fullscreen({
  tooltipPlacement,
  size = 'md',
}: MediaButtonProps) {
  const isActive = useMediaState('fullscreen');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className={`${buttonClass} ${getButtonSize(size)}`}>
          {isActive ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function GoogleCast({
  tooltipPlacement,
  size = 'md',
}: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <GoogleCastButton className="group ring-sky-400 relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4">
          <ChromecastIcon className={`${buttonClass} ${getButtonSize(size)}`} />
        </GoogleCastButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {'Google Cast'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function SearchButton({
  tooltipPlacement,
  size = 'md',
}: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SearchIcon className={`${buttonClass} ${getButtonSize(size)}`} />
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {'Search Sermon'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function ShareButton({
  tooltipPlacement,
  size = 'md',
}: MediaButtonProps) {
  const location = useLocation();
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const url = window.location.origin + location.pathname;
    if (typeof window === 'undefined') return;

    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {isCopied ? (
          <span className={tooltipClass}>Link Copied!</span>
        ) : (
          <button onClick={handleCopy} aria-label="Copy share link">
            <ShareIcon className={`${buttonClass} ${getButtonSize(size)}`} />
          </button>
        )}
      </Tooltip.Trigger>
      {!isCopied && (
        <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
          {'Share'}
        </Tooltip.Content>
      )}
    </Tooltip.Root>
  );
}

export interface SeekButtonProps extends MediaButtonProps {
  seconds: number;
}

export function Seek({
  seconds,
  tooltipPlacement,
  size = 'md',
}: SeekButtonProps) {
  const isBackward = seconds < 0;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton
          className={`${buttonClass} ${getButtonSize(
            size,
          )} media-ended:opacity-0 media-ended:pointer-events-none media-ended:cursor-not-allowed`}
          seconds={seconds}
        >
          {isBackward ? <SeekBackward10Icon /> : <SeekForward10Icon />}
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isBackward ? 'Seek Backward' : 'Seek Forward'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export interface SkipButtonProps extends MediaButtonProps {
  direction: 'forward' | 'backward';
  onSkipClick: (() => void) | undefined;
}

export function Skip({
  direction,
  onSkipClick,
  tooltipPlacement,
  size = 'md',
}: SkipButtonProps) {
  const isBackward = direction === 'backward';
  const icon = isBackward ? (
    <PreviousIcon
      className={`${buttonClass} ${getButtonSize(
        size,
      )} media-ended:opacity-0 media-ended:pointer-events-none media-ended:cursor-not-allowed`}
    />
  ) : (
    <NextIcon
      className={`${buttonClass} ${getButtonSize(
        size,
      )} media-ended:opacity-0 media-ended:pointer-events-none media-ended:cursor-not-allowed`}
    />
  );
  const aria = isBackward ? 'skip to previous' : 'skip to next';
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button onClick={onSkipClick} aria-label={aria}>
          {icon}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isBackward ? 'Play Previous' : 'Play Next'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
