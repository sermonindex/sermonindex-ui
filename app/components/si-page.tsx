/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import React, { CSSProperties, useState } from 'react';
import { Contributor, Sermon } from '~/api/interfaces';
import { Footer } from './footer';
import { Navbar } from './navigation/navbar';
import Breadcrumbs from '~/components/breadcrumbs';
import { useLocation } from '@remix-run/react';

interface SiPageProps {
  children: React.ReactNode;
  // Passing the sermon from the sermons_.$id route prevents having
  // to re-fetch it from the API for the SermonIndex Page breadcrumbs
  sermon?: Sermon;
  contributor?: Contributor;
}

export function SiPage({ children, sermon, contributor }: SiPageProps) {
  const [navbarOffset, setNavbarOffset] = useState(0);
  const location = useLocation();

  const mainStyle: CSSProperties = {
    '--nav-height': `${navbarOffset}px`,
  };

  return (
    // colored margins
    // <div className="bg-si-dim/20 dark:bg-si-slate/95">
    <div className="bg-si-light dark:bg-si-slate">
      {/*<div className="2xl:container 2xl:mx-auto">*/} {/* 2xl:shadow-2xl */}
      {/*<div className="2xl:container 2xl:mx-auto 2xl:shadow-2xl">*/}
      <div
        className="
          bg-si-light dark:bg-si-slate
          text-si-slate dark:text-si-light"
      >
        <div
          // style={{
          //   paddingTop: `${navbarOffset}px`,
          // }}
          style={mainStyle}
          className="flex-grow"
        >
          <Navbar onEffectiveHeightChange={setNavbarOffset} />
          <Breadcrumbs
            location={location.pathname}
            sermon={sermon}
            contributor={contributor}
          />
          {/* Note: if we want more padding, we should add in children, this
            precise padding allows pinning media content to the top on mobile */}
          {/*<div className={`pt-[${navbarOffset}px] min-h-screen`}>*/}
          <div className={`pt-[var(--nav-height)] xl:pt-0 min-h-screen`}>
            <div className="2xl:container 2xl:mx-auto">
              <main className=" min-h-[calc(100vh-90px)]">{children}</main>
            </div>
            <Footer />
          </div>
        </div>
      </div>
      {/*</div>*/}
      {/*</div>*/}
    </div>
  );
}
