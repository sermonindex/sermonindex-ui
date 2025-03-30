import { Captions, Controls, useMediaState } from '@vidstack/react';

import * as Buttons from './buttons';
import * as Menus from './menus';
import * as Sliders from './sliders';
import { TimeGroup } from './time-group';
import { Gestures } from './gestures';

export interface AudioLayoutProps {
  title: string;
  author?: string;
}

export const CustomLayout = ({ title, author }: AudioLayoutProps) => {
  const viewType = useMediaState('viewType');
  const controlStyle =
    viewType === 'video'
      ? 'absolute bottom-0 left-0 media-controls:opacity-100 z-10 bg-gradient-to-t from-black/80 rounded-b-xl to-transparent opacity-0 transition-opacity text-white'
      : 'flex flex-col';

  return (
    <>
      <Gestures />
      <Captions className="media-captions absolute inset-0 bottom-2 z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300 media-captions:opacity-100 media-controls:bottom-[85px] media-preview:opacity-0 aria-hidden:hidden" />
      <Controls.Root className={`w-full p-4 ${controlStyle}`}>
        {/* Title and Author */}
        <div className="text-left font-light">
          <div className="text-lg md:text-xl">{title}</div>
          <div className="text-xs md:text-sm text-si-dim dark:text-gray-300">
            {author}
          </div>
        </div>

        {/* Time */}
        <Controls.Group className="p-4">
          <Sliders.Time />
          <TimeGroup />
        </Controls.Group>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          {/* Volume */}
          <Controls.Group className="flex items-center w-1/3">
            <Buttons.Mute tooltipPlacement="top" />
            <Sliders.Volume />
          </Controls.Group>

          {/* Play and Seek Buttons */}
          <Controls.Group className="flex items-center justify-center w-1/3">
            <Buttons.Seek seconds={-10} tooltipPlacement="top" />
            <Buttons.Play tooltipPlacement="top" />
            <Buttons.Seek seconds={10} tooltipPlacement="top" />
          </Controls.Group>

          {/* Settings */}
          <Controls.Group className="flex items-center justify-end w-1/3">
            {/*<Buttons.Caption tooltipPlacement="top" />*/}
            <Menus.Settings placement="top end" tooltipPlacement="top end" />
          </Controls.Group>
        </div>
      </Controls.Root>
    </>
  );
};
