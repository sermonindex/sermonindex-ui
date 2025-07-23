import { hasContent, isNumber } from '~/common/sanitize';
import { formatNumber } from '~/common/format-number';
import React from 'react';
import { FiDownload } from 'react-icons/fi';
import { SearchButton, ShareButton } from '~/components/media/buttons';
import { Controls } from '@vidstack/react';
import { SiButton } from '~/components/button';
import * as Buttons from '~/components/media/buttons';

export const Cover = ({
  title,
  author,
  authorImageUrl,
  hits,
  isSearchOpen,
  onSearchIconClick,
  isPlaylistMode,
  onShuffleStateChange,
  shuffleState,
  onRepeatStateChange,
  repeatState,
}: {
  title: string;
  author: string | undefined;
  authorImageUrl: string | undefined;
  hits: number | undefined;
  isSearchOpen: boolean;
  onSearchIconClick: () => void;
  isPlaylistMode: boolean;
  onShuffleStateChange: (state: 'off' | 'on') => void;
  shuffleState?: 'off' | 'on';
  onRepeatStateChange: (state: 'none' | 'repeat-all' | 'repeat-one') => void;
  repeatState?: 'none' | 'repeat-all' | 'repeat-one';
}) => {
  return (
    <div className="w-full">
      <div className="flex w-full justify-between items-start">
        {/* --- Left Column --- */}
        {/* This group contains all the vertically stacked text info */}
        <div className="flex flex-col justify-start text-left font-light space-y-1">
          <Title title={title} />
          <Author author={author} imageUrl={authorImageUrl} />
          <SermonViews views={hits} />
        </div>

        {/* --- Right Column --- */}
        <div className="flex flex-col items-end gap-y-2 sm:flex-row sm:items-center sm:gap-x-1">
          <Controls.Group className="flex items-center gap-x-1">
            <ShareButton tooltipPlacement={'bottom end'} size={'md'} />

            {/* Search Button: Hidden by default, shown on 'sm' screens and up */}
            <div className="hidden sm:block">
              {!isSearchOpen && !isPlaylistMode && (
                <SiButton
                  onClick={onSearchIconClick}
                  aria-label="Open search panel"
                >
                  <SearchButton tooltipPlacement={'bottom end'} size={'md'} />
                </SiButton>
              )}
            </div>
          </Controls.Group>

          {/* Shuffle Button: Shown by default, hidden on 'sm' screens and up */}
          {isPlaylistMode && (
            <div className="block sm:hidden">
              <Controls.Group>
                <div className="flex flex-col gap-y-1">
                  <Buttons.Shuffle
                    onShuffleStateChange={onShuffleStateChange}
                    state={shuffleState}
                    tooltipPlacement="bottom"
                  />
                  <Buttons.Repeat
                    onRepeatStateChange={onRepeatStateChange}
                    state={repeatState}
                    tooltipPlacement="top"
                  />
                </div>
              </Controls.Group>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Title = ({ title }: { title: string }) => {
  return (
    <h1 className="text-lg md:text-xl media-fullscreen:text-2xl font-bold">
      {title}
    </h1>
  );
};

export const SermonViews = ({ views }: { views: number | undefined }) => {
  if (!isNumber(views)) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-2 pt-1">
      <span className="text-xs media-fullscreen:text-sm italic">
        {formatNumber(views)}
      </span>
      <FiDownload />
    </div>
  );
};

export const Author = ({
  author,
  imageUrl,
}: {
  author: string | undefined;
  imageUrl?: string | undefined;
}) => {
  return (
    <div className="flex items-center gap-x-2">
      {hasContent(imageUrl) && (
        <img
          src={imageUrl}
          alt={`Image of ${author || 'author'}`}
          className="w-8 h-8 rounded-full object-cover"
          loading="lazy"
        />
      )}
      <div className="text-sm media-fullscreen:text-base">{author}</div>
    </div>
  );
};
