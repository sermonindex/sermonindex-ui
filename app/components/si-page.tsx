/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import React from 'react';
import { Contributor, Sermon } from '~/api/interfaces';
import { Footer } from './footer';
import { Navbar } from './navbar';

interface SiPageProps {
  children: React.ReactNode;
  // Passing the sermon from the sermons_.$id route prevents having
  // to re-fetch it from the API for the SermonIndex Page breadcrumbs
  sermon?: Sermon;
  contributor?: Contributor;
}

export default function SiPage({ children, sermon, contributor }: SiPageProps) {
  return (
    <div className="bg-si-light dark:bg-si-slate text-si-slate dark:text-si-light">
      <div className="">
        <Navbar />
        <div className="pt-[58px] md:ml-64 min-h-screen">
          <div className="container mx-auto min-h-[calc(100vh-90px)]">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
