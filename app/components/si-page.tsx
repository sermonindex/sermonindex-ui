/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import React from 'react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';

export default function SiPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-si-light dark:bg-si-slate text-si-slate dark:text-si-light">
      <div className="container mx-auto border-x-2 border-si-gray dark:border-si-dim">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
