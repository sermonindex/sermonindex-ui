/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import React, { CSSProperties, useState } from 'react';
import { Contributor, Sermon } from '~/api/interfaces';
import { Footer } from './footer';
import { Navbar } from './navigation/navbar';
import Breadcrumbs from '~/components/breadcrumbs';
import { useLocation } from '@remix-run/react';
import { SiMargins } from '~/components/margin';
import { PostFrontmatter } from '~/routes/blog_.$name';

interface SiPageProps {
  children: React.ReactNode;
  // Passing the sermon from the sermons_.$id route prevents having
  // to re-fetch it from the API for the SermonIndex Page breadcrumbs
  sermon?: Sermon;
  contributor?: Contributor;
  post?: PostFrontmatter;
}

export function SiPage({ children, sermon, contributor, post }: SiPageProps) {
  const [navbarOffset, setNavbarOffset] = useState(0);
  const location = useLocation();

  const mainStyle: CSSProperties = {
    '--nav-height': `${navbarOffset}px`,
  };

  return (
    <div className="bg-si-light dark:bg-si-slate">
      <SiMargins>
        <div
          className="
          text-si-slate dark:text-si-light
          text-sm md:text-base
          "
        >
          <div style={mainStyle} className="flex-grow">
            <Navbar onEffectiveHeightChange={setNavbarOffset} />
            <Breadcrumbs
              location={location.pathname}
              sermon={sermon}
              contributor={contributor}
              post={post}
            />
            {/* Note: if we want more padding, we should add in children, this
            precise padding allows pinning media content to the top on mobile */}
            <div className={`pt-[var(--nav-height)] lg:pt-0 min-h-screen`}>
              <main className=" min-h-[calc(100vh-90px)]">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
      </SiMargins>
    </div>
  );
}
