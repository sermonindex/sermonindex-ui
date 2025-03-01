import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

interface SiSectionProps {
  title: string;
  // todo: make this non-optional in the future when it is implemented everywhere
  tag?: string;
  expandable?: boolean;
  defaultExpanded?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SiSection({
  title,
  tag = title,
  expandable = false,
  defaultExpanded = false,
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

  return (
    <div className="flex flex-col md:pt-3 md:px-8" id={tag}>
      <div className="flex flex-col w-full p-4">
        {expandable ? (
          <>
            <button
              className={`flex items-center justify-between px-4 py-1 md:py-2 bg-si-gray rounded-lg w-full text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
              onClick={() => setOpen(!open)}
            >
              <div className="flex">
                <span className="text-left text-lg md:text-xl font-light">
                  <h1>{title}</h1>
                </span>
              </div>
              <div className="flex text-sm items-center justify-center">
                <FaChevronDown
                  className={`${
                    open ? '' : 'rotate-180'
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
              <div className="p-4">{children}</div>
            </div>
          </>
        ) : (
          <>
            <h1
              className={`flex items-center text-lg md:text-xl justify-between px-4 py-1 md:py-2 bg-si-gray rounded-lg w-full text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
            >
              {title}
            </h1>
            <div className="p-4">{children}</div>
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
