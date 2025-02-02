import React from 'react';

interface Props {
  text: string;
  className?: string; // Allow for custom classes
}

/// Deprecated. Prefer SiSection moving forward
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

interface SiSectionProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export function SiSection({ title, className, children }: SiSectionProps) {
  return (
    <>
      <div className="flex flex-col space-y-8 md:pt-3 md:px-8 min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full p-4">
          <h1
            className={`md:text-xl pl-4 py-1 md:py-2 bg-si-gray rounded-lg w-full text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
          >
            {title}
          </h1>
          {children}
        </div>
      </div>
    </>
  );
}

interface ClickableTextProps {
  children: React.ReactNode;
}

export function ClickableText({ children }: ClickableTextProps) {
  return (
    <span className="cursor-pointer hover:underline text-si-main dark:text-si-olive">
      {children}
    </span>
  );
}
