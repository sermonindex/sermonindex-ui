/// This is the SermonIndex "page template" component that should wrap every
/// page (ie. route) in the SermonIndex app. It provides a consistent layout
/// and styling for all pages.

import React from 'react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import { Sermon } from '~/api/interfaces';

interface SiPageProps {
  children: React.ReactNode;
  sermon?: Sermon;
}

export default function SiPage({ children, sermon }: SiPageProps) {
  return (
    <div className="bg-si-light dark:bg-si-slate text-si-slate dark:text-si-light">
      <div className="container mx-auto border-x-2 border-si-gray dark:border-si-dim">
        <Header sermon={sermon} />
        {children}
        <Footer />
      </div>
    </div>
  );
}
