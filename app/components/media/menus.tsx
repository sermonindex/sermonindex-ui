import React, { useState } from 'react';

import {
  Menu,
  Tooltip,
  useCaptionOptions,
  usePlaybackRateOptions,
  type MenuPlacement,
  type TooltipPlacement,
  useVideoQualityOptions,
  useMediaState,
  SpeedSlider,
  Src,
} from '@vidstack/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClosedCaptionsIcon,
  DownloadIcon,
  MenuVerticalIcon,
  PlaybackSpeedCircleIcon,
  RadioButtonIcon,
  RadioButtonSelectedIcon,
  SettingsMenuIcon,
} from '@vidstack/react/icons';

import { buttonClass, tooltipClass } from './buttons';
import { downloadMP3, downloadMP4 } from '~/common/download';
import { LoadingSpinner } from '~/components/spinner';

export interface SettingsProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
  downloadUrl?: string;
}

export const menuClass = [
  // Base State (Closed): Applied when data-open is not present
  'max-h-0', // Start collapsed
  'overflow-hidden', // Hide content when collapsed

  'z-50', // menu takes highest z-index as it opens overtop everything else

  // Layout & Base Styling (Always Applied):
  'min-w-[200px]',
  'flex',
  'flex-col',
  'rounded-md',
  'border',
  'border-white/10',
  'bg-black/10',
  'dark:bg-black/30',
  'backdrop-blur-md',
  'p-2',
  'text-sm',
  'font-medium',
  'outline-none',

  // Transition Logic:
  'transition-[max-height] duration-300 ease-in-out', // Smoothly transition max-height
  'will-change-[max-height]', // Hint for performance

  // Open State Styling (Applied when data-open IS present):
  'data-[open]:max-h-[400px]', // Set max-height when open (adjust value if needed)
  'data-[open]:overflow-y-auto', // Allow scrolling when open

  // Existing Vidstack Animations
  'animate-out fade-out slide-out-to-bottom-2', // Base exit animation classes
  'data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4', // data-open enter animation

  // Style during resizing
  'data-[resizing]:overflow-hidden',
].join(' ');

export const submenuClass =
  'hidden w-full flex-col items-start justify-center outline-none data-[keyboard]:mt-[3px] data-[open]:inline-block';

export function Settings({
  placement,
  tooltipPlacement,
  downloadUrl,
}: SettingsProps) {
  return (
    <Menu.Root className="parent">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            {/* Yes, yes I yak shaved this settings icon */}
            <MenuVerticalIcon className="h-8 w-8 transform-gpu transition-transform duration-300 ease-spring group-data-[open]:scale-y-75" />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
          Settings
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Content className={menuClass} placement={placement}>
        <CaptionSubmenu />
        <PlaybackRateSubmenu />
        <QualitySubmenu />
        <DownloadSubmenu customDownloadUrl={downloadUrl} />
      </Menu.Content>
    </Menu.Root>
  );
}

function CaptionSubmenu() {
  const options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? 'Off',
    hasCaptions = useMediaState('hasCaptions');

  return (
    <Menu.Root>
      <SubmenuButton
        label="Captions"
        hint={hint}
        disabled={options.disabled}
        locked={!hasCaptions}
        icon={ClosedCaptionsIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className="w-full flex flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function PlaybackRateSubmenu() {
  const options = usePlaybackRateOptions();
  const hint =
    options.selectedValue === '1' ? 'Normal' : options.selectedValue + 'x';
  return (
    <Menu.Root>
      <SubmenuButton
        label="Playback Rate"
        hint={hint}
        disabled={options.disabled}
        icon={PlaybackSpeedCircleIcon}
      />
      <Menu.Content className={submenuClass}>
        <SpeedSlider.Root className="speed-slider group relative pl-6 w-[90%] inline-flex h-8 cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
          <SpeedSlider.Track className="relative ring-media-focus z-0 h-[5px] w-full rounded-sm bg-black/30 dark:bg-white/30 media-view-video:bg-white/30 media-fullscreen:bg-white/30 group-data-[focus]:ring-[3px]"></SpeedSlider.Track>
          <SpeedSlider.Thumb
            className={`
          absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full
          border bg-white border-gray-800 dark:border-[#cacaca] media-view-video:border-[#cacaca] media-fullscreen:border-[#cacaca]
          ring-black/40 dark:ring-white/40 media-view-video:dark:ring-white/40 media-fullscreen:dark:ring-white/40
          group-data-[dragging]:ring-4 will-change-[left]
        `}
          />
        </SpeedSlider.Root>
      </Menu.Content>
    </Menu.Root>
  );
}

function QualitySubmenu() {
  const options = useVideoQualityOptions({ auto: true, sort: 'descending' }),
    currentQualityHeight = options.selectedQuality?.height,
    hint =
      options.selectedValue !== 'auto' && currentQualityHeight
        ? `${currentQualityHeight}p`
        : `Auto${currentQualityHeight ? ` (${currentQualityHeight}p)` : ''}`;
  return (
    <Menu.Root>
      <SubmenuButton
        label="Quality"
        hint={hint}
        disabled={options.disabled}
        locked={options.length === 1}
        icon={SettingsMenuIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className="w-full flex flex-col"
          value={options.selectedValue}
        >
          {options.map(({ quality, label, value, bitrateText, select }) => (
            <Menu.Radio value={value} onSelect={select} key={value}>
              {label}
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function DownloadSubmenu({
  customDownloadUrl,
}: {
  customDownloadUrl?: string;
}) {
  const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);

  const source = useMediaState('source') as Src;
  const title = useMediaState('title');
  const mediaType = useMediaState('mediaType');
  const srcString = typeof source.src === 'string' ? source.src : '';
  const isYouTube = srcString.includes('youtube');
  const downloadHref = isYouTube ? customDownloadUrl : srcString;

  const onDownloadVideo = async () => {
    if (!downloadHref || isDownloadingVideo || isDownloadingAudio) return;
    setIsDownloadingVideo(true);
    try {
      await downloadMP4(downloadHref, `${title}.mp4`);
    } finally {
      setIsDownloadingVideo(false);
    }
  };

  const onDownloadAudio = async () => {
    if (!downloadHref || isDownloadingVideo || isDownloadingAudio) return;
    setIsDownloadingAudio(true);
    try {
      await downloadMP3(downloadHref, `${title}.mp3`);
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  const getHint = () => {
    if (mediaType === 'video') return 'Video';
    if (mediaType === 'audio') return 'Audio';
    return '';
  };

  const canDownload =
    !!downloadHref && (mediaType === 'audio' || mediaType === 'video');
  const isDownloading = isDownloadingVideo || isDownloadingAudio;

  return (
    <Menu.Root>
      <SubmenuButton
        label="Download"
        hint={getHint()}
        disabled={!canDownload || isDownloading}
        icon={isDownloading ? LoadingSpinner : DownloadIcon}
        locked={true}
        handleClick={mediaType === 'video' ? onDownloadVideo : onDownloadAudio}
      />
      <Menu.Content className={submenuClass}>
        <Menu.Item />
      </Menu.Content>
    </Menu.Root>
  );
}

export interface RadioProps extends Menu.RadioProps {}

function Radio({ children, ...props }: RadioProps) {
  return (
    <Menu.Radio
      className="ring-media-focus group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm pl-6 outline-none data-[hocus]:bg-white/10 data-[focus]:ring-[3px]"
      {...props}
    >
      <RadioButtonIcon className="h-4 w-4 group-data-[checked]:hidden" />
      <RadioButtonSelectedIcon className="text-media-brand hidden h-4 w-4 group-data-[checked]:block" />
      <span className="ml-2">{children}</span>
    </Menu.Radio>
  );
}

export interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  locked?: boolean;
  icon: React.ComponentType<{ className: string }>;
  handleClick?: () => void;
}

function SubmenuButton({
  label,
  hint,
  icon: Icon,
  disabled,
  locked = false,
  handleClick,
}: SubmenuButtonProps) {
  return (
    <Menu.Button
      className="ring-media-focus group flex w-full cursor-pointer select-none items-center justify-between gap-x-6 rounded-sm p-2.5 text-left outline-none ring-inset data-[open]:sticky data-[open]:-top-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-[3px]"
      disabled={disabled}
      onClick={handleClick}
    >
      {/* Left Group */}
      <div className="flex items-center gap-x-1.5">
        <ChevronLeftIcon className="hidden h-[18px] w-[18px] group-data-[open]:block" />
        <div className="flex items-center group-data-[open]:hidden">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span>{label}</span>
      </div>

      {/* Right Group */}
      {(hint || !disabled) && (
        <div className="flex items-center gap-x-1.5 text-sm text-black/50 dark:text-white/50 media-view-video:text-white/50">
          {hint && <span className="inline-block w-12 text-right">{hint}</span>}
          {locked ? null : (
            <ChevronRightIcon className="h-[18px] w-[18px] group-data-[open]:hidden" />
          )}
        </div>
      )}
    </Menu.Button>
  );
}
