/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import React, { useState } from 'react';
import { Contributor, Sermon } from '~/api/interfaces';
import { Footer } from './footer';
import { Navbar } from './navigation/navbar';

interface SiPageProps {
  children: React.ReactNode;
  // Passing the sermon from the sermons_.$id route prevents having
  // to re-fetch it from the API for the SermonIndex Page breadcrumbs
  sermon?: Sermon;
  contributor?: Contributor;
}

export default function SiPage({ children, sermon, contributor }: SiPageProps) {
  const [navbarOffset, setNavbarOffset] = useState(0);

  return (
    <div className="bg-si-light dark:bg-si-slate text-si-slate dark:text-si-light">
      <div
        style={{
          paddingTop: `${navbarOffset}px`,
        }}
        className="flex-grow"
      >
        <Navbar onEffectiveHeightChange={setNavbarOffset} />
        {/* Note: if we want more padding, we should add in children, this
            precise padding allows pinning media content to the top on mobile */}
        <div className={`pt-[${navbarOffset}px] min-h-screen`}>
          <main className="container mx-auto min-h-[calc(100vh-90px)]">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
