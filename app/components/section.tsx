import { Link, useLocation } from '@remix-run/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { formatNumber } from '~/common/format-number';
import { hasContent } from '~/common/sanitize';

interface SiSectionProps {
  title?: string;
  tag?: string;
  count?: number;
  expandable?: boolean;
  defaultExpanded?: boolean;
  sharesLeftPadding?: boolean;
  sharesRightPadding?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SiSection({
  title = '',
  tag = title,
  count,
  expandable = false,
  defaultExpanded = false,
  sharesLeftPadding = false,
  sharesRightPadding = false,
  className,
  children,
}: SiSectionProps) {
  const [open, setOpen] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      setContentHeight(null); // Set to null when closed to avoid a flash of content
    }
  }, [open, children]);

  // This allows sections to be in columns beside each other without
  // double padding that looks like a big hold between the sections.
  let paddingLeft = sharesLeftPadding ? 'pl-2 md:pl-4' : 'pl-4 md:pl-8';
  let paddingRight = sharesRightPadding ? 'pr-2 md:pr-4' : 'pr-4 md:pr-8';
  let padding = `py-4 ${paddingLeft} ${paddingRight}`;

  const location = useLocation();
  const linkTo = `${location.pathname}#${tag}`;

  // const headingStyles = `text-lg md:text-xl px-4 py-1 md:py-2 rounded-lg w-full text-black dark:text-white bg-neutral-200 dark:bg-neutral-600 shadow-lg ${className}`;
  const headingStyles = `text-lg md:text-xl px-4 py-1 md:py-2 w-full text-black dark:text-white border-b-2 border-b border-neutral-300 dark:border-neutral-700 pb-2 ${className}`;
  const countStyles =
    'flex items-center justify-center w-12 h-5 ms-2 text-xs rounded-full text-black dark:text-white bg-neutral-300 dark:bg-neutral-700';

  const getSectionTitle = () => {
    return (
      <h1 className="flex items-center space-x-4">
        <span>{title}</span>
        {count && <span className={countStyles}>{formatNumber(count)}</span>}
      </h1>
    );
  };

  if (!hasContent(title)) {
    return <div className={`flex flex-col w-full ${padding}`}>{children}</div>;
  }

  // Determine the class for the children container based on whether children exist
  const childrenContainerClass =
    React.Children.count(children) > 0 ? 'px-2 py-3 md:px-4 md:py-4' : '';

  return (
    <div className="flex flex-col" id={tag}>
      <div className={`flex flex-col w-full ${padding}`}>
        {expandable ? (
          <>
            <button
              className={`flex items-center justify-between ${headingStyles}`}
              onClick={() => setOpen(!open)}
            >
              <div className="flex">
                <span className="text-left text-lg md:text-xl font-light">
                  <Link to={linkTo}>{getSectionTitle()}</Link>
                </span>
              </div>
              <div className="flex text-sm items-center justify-center">
                <FaChevronDown
                  className={`${
                    open ? 'rotate-180' : ''
                  } shrink-0 transition-transform duration-500`}
                  aria-hidden="true"
                />
              </div>
            </button>

            <div
              ref={contentRef}
              className="overflow-hidden transition-max-height duration-500"
              style={{
                maxHeight: contentHeight ? `${contentHeight}px` : '0px',
              }}
            >
              <div className={childrenContainerClass}>{children}</div>
            </div>
          </>
        ) : (
          <>
            <Link to={linkTo} className={headingStyles}>
              {getSectionTitle()}
            </Link>
            <div className={childrenContainerClass}>{children}</div>
          </>
        )}
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
