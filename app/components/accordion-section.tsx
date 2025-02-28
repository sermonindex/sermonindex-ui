import React, { useState } from 'react';

interface AccordionSectionProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
}

/// @deprecated Prefer SiSection moving forward - putting all section styling in a single place
export const AccordionSection: React.FC<AccordionSectionProps> = ({
  text,
  className,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4">
      <div>
        <button
          className={`flex items-center justify-between md:text-xl px-4 py-1 md:py-2 bg-si-gray rounded-lg w-full text-black dark:text-white dark:bg-si-dark shadow-lg ${className}`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex">
            <span className="text-sm md:text-lg text-left font-light">
              <h1>{text}</h1>
            </span>
          </div>
          <div className="flex text-sm md:text-lg items-center justify-center">
            <svg
              data-accordion-icon
              className={`${open ? '' : 'rotate-180'} w-3 =-3 shrink-0`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </div>
        </button>
      </div>
      <div className={`${open ? 'block' : 'hidden'}`}>{children}</div>
    </div>
  );
};
