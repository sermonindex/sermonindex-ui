import React from 'react';

interface Props {
  text: string;
  className?: string; // Allow for custom classes
}

/// This is a common section heading for page content
/// todo: It would be nice to add an optional "copy link" icon that hyperlinks to this section
export const StandardHeader: React.FC<Props> = ({ text, className }) => {
  return (
    <h1
      className={`md:text-xl pl-4 py-1 md:py-2 bg-si-gray rounded-lg w-full text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
    >
      {text}
    </h1>
  );
};
