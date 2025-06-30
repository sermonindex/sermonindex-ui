import React from 'react';
import { formatNumber } from '~/common/format-number';
import { hasContent } from '~/common/sanitize';
import { SiHeading1 } from '~/components/si-styles';

interface SiSectionProps {
  title?: string;
  tag?: string;
  count?: number;
  sharesLeftPadding?: boolean;
  sharesRightPadding?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SiSection({
  title = '',
  tag = title,
  count,
  sharesLeftPadding = false,
  sharesRightPadding = false,
  className,
  children,
}: SiSectionProps) {
  // This allows sections to be in columns beside each other without
  // double padding that looks like a big hold between the sections.
  let paddingLeft = sharesLeftPadding ? 'pl-1 md:pl-4' : 'pl-1 md:pl-8';
  let paddingRight = sharesRightPadding ? 'pr-1 md:pr-4' : 'pr-1 md:pr-8';
  let padding = `py-2 ${paddingLeft} ${paddingRight}`;

  const countStyles =
    'flex items-center justify-center w-12 h-5 ms-2 text-xs rounded-full text-black dark:text-white bg-neutral-300 dark:bg-neutral-700';

  const getSectionTitle = () => {
    return (
      <SiHeading1
        className={`flex flex-row w-full items-center space-x-4 ${className}`}
        customId={tag}
      >
        <span>{title}</span>
        {count && <span className={countStyles}>{formatNumber(count)}</span>}
      </SiHeading1>
    );
  };

  if (!hasContent(title)) {
    return <div className={`flex flex-col w-full ${padding}`}>{children}</div>;
  }

  // Determine the class for the children container based on whether children exist
  const childrenContainerClass =
    React.Children.count(children) > 0 ? 'px-1 py-1 md:px-2 md:py-2' : '';

  return (
    <div className={`flex flex-col w-full ${padding}`}>
      {getSectionTitle()}
      <div className={`flex flex-col w-full`}>
        <div className={childrenContainerClass}>{children}</div>
      </div>
    </div>
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
