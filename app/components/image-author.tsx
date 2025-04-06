import { hasContent } from '~/common/sanitize';
import React from 'react';

export const AuthorImage = ({
  author,
  imageUrl,
}: {
  author: string;
  imageUrl: string | undefined;
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
      <span>{author}</span>
    </div>
  );
};
