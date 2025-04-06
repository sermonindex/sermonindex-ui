import { Link, useLocation } from '@remix-run/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { hasContent } from '~/common/sanitize';

interface SiSectionProps {
  title?: string;
  tag?: string;
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

  if (!hasContent(title)) {
    return <div className={`flex flex-col w-full ${padding}`}>{children}</div>;
  }

  return (
    <div className="flex flex-col" id={tag}>
      <div className={`flex flex-col w-full ${padding}`}>
        {expandable ? (
          <>
            <button
              className={`flex items-center justify-between rounded-lg w-full px-4 py-1 text-lg md:text-xl md:py-2 bg-si-gray text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
              onClick={() => setOpen(!open)}
            >
              <div className="flex">
                <span className="text-left text-lg md:text-xl font-light">
                  <Link to={linkTo}>
                    <h1>{title}</h1>
                  </Link>
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
              <div className="md:p-4">{children}</div>
            </div>
          </>
        ) : (
          <>
            <Link to={linkTo}>
              <h1
                className={`flex items-center text-lg md:text-xl px-4 py-1 md:py-2 bg-si-gray rounded-lg w-full text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
              >
                {title}
              </h1>
            </Link>
            <div className="md:p-4">{children}</div>
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
