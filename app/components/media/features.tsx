import { hasContent, isNumber } from '~/common/sanitize';
import { formatNumber } from '~/common/format-number';
import React from 'react';
import { FiDownload } from 'react-icons/fi';
import { SearchButton } from '~/components/media/buttons';
import { Controls } from '@vidstack/react';

export const Cover = ({
  title,
  author,
  authorImageUrl,
  hits,
  isSearchOpen,
  onSearchIconClick,
  isPlaylistMode,
}: {
  title: string;
  author: string | undefined;
  authorImageUrl: string | undefined;
  hits: number | undefined;
  isSearchOpen: boolean;
  onSearchIconClick: () => void;
  isPlaylistMode: boolean;
}) => {
  return (
    <div className="w-full">
      <div className="w-full justify-start text-left font-light space-y-2 pb-1">
        <div className="flex w-full justify-between items-center">
          <Title title={title} />
          {!isSearchOpen && !isPlaylistMode && (
            <button onClick={onSearchIconClick} aria-label="Open search panel">
              <Controls.Group>
                <SearchButton tooltipPlacement={'bottom end'} size={'md'} />
              </Controls.Group>
            </button>
          )}
        </div>
        <Author author={author} imageUrl={authorImageUrl} />
        <SermonViews views={hits} />
      </div>
    </div>
  );
};

export const Title = ({ title }: { title: string }) => {
  return <h1 className="text-lg md:text-xl font-bold">{title}</h1>;
};

export const SermonViews = ({ views }: { views: number | undefined }) => {
  if (!isNumber(views)) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-2 pt-1">
      <span className="text-xs italic">{formatNumber(views)}</span>
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
        />
      )}
      <div className="text-xs md:text-sm">{author}</div>
    </div>
  );
};
