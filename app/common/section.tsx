import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

interface Props {
  text: string;
  className?: string; // Allow for custom classes
}

/// @deprecated Prefer SiSection moving forward
/// This is a common section heading for page content
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
  expandable?: boolean;
  defaultExpanded?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SiSection({
  title,
  expandable = false,
  defaultExpanded = false,
  className,
  children,
}: SiSectionProps) {
  const [open, setOpen] = useState(defaultExpanded);

  return (
    <div className="flex flex-col space-y-8 md:pt-3 md:px-8 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full p-4">
        {expandable ? (
          <>
            <button
              className={`flex items-center justify-between px-4 py-1 md:py-2 bg-si-gray rounded-lg w-full text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
              onClick={() => setOpen(!open)}
            >
              <div className="flex">
                <span className="text-left text-xl font-light">
                  <h1>{title}</h1>
                </span>
              </div>
              <div className="flex text-sm items-center justify-center">
                <FaChevronDown
                  className={`${
                    open ? '' : 'rotate-180'
                  } shrink-0 transition-transform duration-300`}
                  aria-hidden="true"
                />
              </div>
            </button>

            <div
              className={`p-4 overflow-hidden transition-max-height duration-300 ${
                open ? 'max-h-[500px]' : 'max-h-0'
              }`}
            >
              {children}
            </div>
          </>
        ) : (
          <>
            <h1
              className={`flex items-center text-xl justify-between px-4 py-1 md:py-2 bg-si-gray rounded-lg w-full text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
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
