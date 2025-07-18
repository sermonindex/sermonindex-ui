/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import { useLocation } from '@remix-run/react';
import React from 'react';
import { Contributor, Sermon } from '~/api/interfaces';
import Breadcrumbs from '~/components/breadcrumbs';
import { SiMargins } from '~/components/margin';
import { PostFrontmatter } from '~/routes/blog_.$name';
import { Footer } from './footer';
import { Navbar } from './navigation/navbar';

interface SiPageProps {
  children: React.ReactNode;
  // Passing the sermon from the sermons_.$id route prevents having
  // to re-fetch it from the API for the SermonIndex Page breadcrumbs
  sermon?: Sermon;
  contributor?: Contributor;
  post?: PostFrontmatter;
  showBreadCrumb?: boolean;
}

export function SiPage({
  children,
  sermon,
  contributor,
  post,
  showBreadCrumb = true,
}: SiPageProps) {
  const location = useLocation();

  return (
    <div className="bg-si-light dark:bg-si-slate">
      <SiMargins>
        <div
          className="
          text-si-slate dark:text-si-light
          text-sm md:text-base
          "
        >
          <div className="flex-grow mt-[65px] lg:mt-0">
            <Navbar />
            {showBreadCrumb && (
              <Breadcrumbs
                location={location.pathname}
                sermon={sermon}
                contributor={contributor}
                post={post}
              />
            )}
            <div className={`min-h-screen`}>
              <main className=" min-h-[calc(100vh-90px)]">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
      </SiMargins>
    </div>
  );
}
