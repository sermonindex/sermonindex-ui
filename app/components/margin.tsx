import React from 'react';

interface SiMarginProps {
  children: React.ReactNode;
}

// `mx-auto` does this awkward re-sizing at each breakpoint. It is really much
// more useful for margins between single breakpoints, not across multiple
// breakpoints. Normally, you wouldn't add margins to such small screens because
// you waste so much real estate, but alas, Greg wants pronounced margins on his
// small laptop screen (1440 x 900).
export const SiMargins = ({ children }: SiMarginProps) => {
  return (
    <div className="lg:w-full">
      <div className="lg:px-16">
        <div className="lg:mx-auto lg:max-w-6xl lg:border-x-2 lg:border-si-gray lg:dark:border-si-rock">
          {children}
        </div>
      </div>
    </div>
  );
};
