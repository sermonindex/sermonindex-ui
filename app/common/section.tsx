import React from 'react';

interface Props {
  text: string;
  className?: string; // Allow for custom classes
}

export const StandardHeader: React.FC<Props> = ({ text, className }) => {
  return (
    <h1
      className={`text-2xl pl-4 py-2 bg-gray-300 rounded-lg w-full text-black ${className}`}
    >
      {text}
    </h1>
  );
};
