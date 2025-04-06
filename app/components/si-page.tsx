/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import React from 'react';
import { Contributor, Sermon } from '~/api/interfaces';
import { Footer } from './footer';
import { Header } from './header';

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
      <div className="container mx-auto md:border-x-2 md:border-si-gray md:dark:border-si-dim">
        <Header sermon={sermon} contributor={contributor} />
        {children}
        <Footer />
      </div>
    </div>
  );
}
