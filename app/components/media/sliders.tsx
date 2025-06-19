import {
  TimeSlider,
  useMediaPlayer,
  useMediaRemote,
  useMediaState,
  VolumeSlider,
  type SliderValueChangeEvent,
} from '@vidstack/react';
import { tooltipClass } from '~/components/media/buttons';
import { useRef } from 'react';

export function Volume() {
  return (
    <VolumeSlider.Root className="volume-slider group relative mx-[7.5px] inline-flex h-10 w-full max-w-12 md:max-w-24 cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
      <VolumeSlider.Track className="relative ring-media-focus z-0 h-[5px] w-full rounded-sm bg-black/30 dark:bg-white/30 media-view-video:bg-white/30 media-fullscreen:bg-white/30 group-data-[focus]:ring-[3px]">
        <VolumeSlider.TrackFill className="bg-black/50 dark:bg-white/50 media-view-video:bg-white/50 media-fullscreen:bg-white/50 absolute h-full w-[var(--slider-fill)] rounded-sm will-change-[width]" />
      </VolumeSlider.Track>

      <VolumeSlider.Preview
        className="flex flex-col items-center opacity-0 transition-opacity duration-200 data-[visible]:opacity-100 pointer-events-none"
        noClamp
      >
        <div className="relative -bottom-2">
          <VolumeSlider.Value className={tooltipClass} />
        </div>
      </VolumeSlider.Preview>
      <VolumeSlider.Thumb
        className={`
          absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full
          border bg-white border-gray-800 dark:border-[#cacaca] media-view-video:border-[#cacaca] media-fullscreen:border-[#cacaca]
          ring-black/40 dark:ring-white/40 media-view-video:dark:ring-white/40 media-fullscreen:dark:ring-white/40
          transition-opacity group-data-[active]:opacity-100 group-data-[dragging]:ring-4 will-change-[left]
        `}
      />
    </VolumeSlider.Root>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}

export function Time({ thumbnails }: TimeSliderProps) {
  const player = useMediaPlayer();
  const remote = useMediaRemote();
  const isEnded = useMediaState('ended');
  const wasSeekingFromEnded = useRef(false);

  const handleSliderValueChange = async (
    detail: number,
    event: SliderValueChangeEvent,
  ) => {
    if (!player || !remote || !isEnded || !event.trigger) {
      // If not ended, let the slider behave normally
      // event.trigger filters out programmatic changes
      return;
    }

    // Vidstack does not reset the `isEnded` event after media has ended
    // unless we specifically call the player.play() -- this is a workaround
    // to allow the user to interact with the time slider after the media
    // has finished.
    const seekTime = detail;

    // Only initiate the play/pause dance once per interaction
    if (!wasSeekingFromEnded.current) {
      console.warn('Slider interaction while ended. Applying workaround...');
      wasSeekingFromEnded.current = true;

      // Set time directly (might not take effect immediately visually)
      player.currentTime = seekTime;

      // Force state reset with play
      await player
        .play()
        .then(() => {
          console.log('Workaround: Played to unlock state');

          // Crucially, ensure the slider reflects the *actual* new time after pause
          // This might be needed if player.currentTime = seekTime didn't update state
          // properly before play
          if (player.currentTime !== seekTime) {
            player.currentTime = seekTime;
          }
        })
        .catch((err: any) => {
          console.error('Workaround play/pause error:', err);
          wasSeekingFromEnded.current = false;
        });
      // Pause immediately to mimic seek behavior
      // todo: I think just let it play here
      // await player.pause().then(() => {
      //   console.log('Paused at new time: ', player.currentTime);
      // });
    } else {
      // If already seeking from ended (e.g., dragging), just update the target time
      // The play/pause dance is already initiated or completed.
      // Ensure currentTime is set (might still be ignored until play/pause resolves)
      player.currentTime = seekTime;
    }
  };

  const handleSliderDragEnd = async () => {
    // Reset the flag when interaction finishes
    if (wasSeekingFromEnded.current) {
      console.log('Slider drag/interaction ended, resetting workaround flag.');
      wasSeekingFromEnded.current = false;
    }
  };

  return (
    <div className={'px-2'}>
      <TimeSlider.Root
        onValueChange={handleSliderValueChange}
        onDragEnd={handleSliderDragEnd}
        className="time-slider group relative inline-flex w-full cursor-pointer touch-none select-none items-center outline-none"
      >
        <TimeSlider.Chapters className="relative flex h-full w-full items-center rounded-[1px]">
          {(cues, forwardRef) =>
            cues.map((cue) => (
              <div
                className="last-child:mr-0 relative mr-0.5 flex h-full w-full items-center rounded-[1px]"
                style={{ contain: 'layout style' }}
                key={cue.startTime}
                ref={forwardRef}
              >
                <TimeSlider.Track className="relative ring-media-focus z-0 h-[5px] w-full rounded-sm bg-black/30 dark:bg-white/30 media-view-video:bg-white/30 media-fullscreen:bg-white/30 group-data-[focus]:ring-[3px]">
                  <TimeSlider.TrackFill className="bg-media-brand absolute h-full w-[var(--chapter-fill)] rounded-sm will-change-[width]" />
                  <TimeSlider.Progress className="absolute z-10 h-full w-[var(--chapter-progress)] rounded-sm bg-black/50 dark:bg-white/50 media-view-video:bg-white/50 media-fullscreen:bg-white/50 will-change-[width]" />
                </TimeSlider.Track>
              </div>
            ))
          }
        </TimeSlider.Chapters>

        <TimeSlider.Thumb
          className={
            'absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2' +
            ' rounded-full border bg-white' + // thumb fill
            ' border-gray-800 dark:border-[#cacaca] media-view-video:border-[#cacaca] media-fullscreen:border-[#cacaca]' + // ring border
            ' ring-black/40 dark:ring-white/40 media-view-video:dark:ring-white/40 media-fullscreen:dark:ring-white/40' + // ring when dragging
            ' group-data-[dragging]:ring-4' +
            ' transition-opacity group-data-[active]:opacity-100' +
            ' will-change-[left]'
          }
        />

        <TimeSlider.Preview className="flex flex-col items-center opacity-0 transition-opacity duration-200 data-[visible]:opacity-100 pointer-events-none">
          {thumbnails ? (
            <TimeSlider.Thumbnail.Root
              src={thumbnails}
              className="block h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
            >
              <TimeSlider.Thumbnail.Img />
            </TimeSlider.Thumbnail.Root>
          ) : null}

          <TimeSlider.ChapterTitle className="mt-2 text-sm" />
          <div className="pb-2">
            <TimeSlider.Value className={tooltipClass} />
          </div>
        </TimeSlider.Preview>
      </TimeSlider.Root>
    </div>
  );
}
