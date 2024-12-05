/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import React from 'react';
import { Footer } from './footer';
import { Header } from './header';

interface SiPageProps {
  children: React.ReactNode;
}

export default function SiPage({ children }: SiPageProps) {
  return (
    <div className="bg-si-light dark:bg-si-slate text-si-slate dark:text-si-light">
      <div className="container mx-auto md:border-x-2 md:border-si-gray md:dark:border-si-dim">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
