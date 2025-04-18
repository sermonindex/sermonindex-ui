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
} from '@vidstack/react';
import {
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureExitIcon,
  PictureInPictureIcon,
  PlayIcon,
  ReplayIcon,
  SeekBackward10Icon,
  SeekForward10Icon,
  VolumeHighIcon,
  VolumeLowIcon,
} from '@vidstack/react/icons';
import React from 'react';

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
  'animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-30 rounded-full bg-black/10 dark:bg-black/30 backdrop-blur-sm px-2 py-px text-xs font-medium parent-data-[open]:hidden';

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
