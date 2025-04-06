import { hasContent, isNumber } from '~/common/sanitize';
import { formatNumber } from '~/common/format-number';
import { FaEye } from 'react-icons/fa';
import React from 'react';

export const Cover = ({
  title,
  author,
  authorImageUrl,
  hits,
}: {
  title: string;
  author: string | undefined;
  authorImageUrl: string | undefined;
  hits: number | undefined;
}) => {
  return (
    <div className="w-full justify-start text-left font-light space-y-1 pb-1">
      <div className="flex w-full justify-between items-center">
        <Title title={title} />
        <SermonViews views={hits} />
      </div>
      <Author author={author} imageUrl={authorImageUrl} />
    </div>
  );
};

export const Title = ({ title }: { title: string }) => {
  return <p className="text-lg md:text-xl font-bold">{title}</p>;
};

export const SermonViews = ({ views }: { views: number | undefined }) => {
  if (!isNumber(views)) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-1">
      <span className="text-xs italic">{formatNumber(views)}</span>
      <FaEye />
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
    <div className="flex items-center gap-x-2 mt-1">
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
