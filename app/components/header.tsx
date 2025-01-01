import { Link, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { hasContent } from '~/common/sanitize';
import { SermonSearch } from './sermon-search';
import Breadcrumbs from '~/components/breadcrumbs';
import { Contributor, Sermon } from '~/api/interfaces';
interface PageLink {
  name: string;
  short?: string;
  linkTo: string;
  // todo: add screen size min to show (like sm, md, lg, xl)
  // todo: add smallText for sm,
  // todo: add largeText for lg, etc.
  // if no text for sm then it should not be shown on sm
}

const Links: { [key: string]: PageLink } = {
  speakers: { name: 'All Speakers', short: 'Speakers', linkTo: 'speakers' },
  top100: { name: 'Top 100 Sermons', short: 'Top 100', linkTo: 'top-100' },
  recommended: {
    name: 'Recommended Sermons',
    short: 'Recommended',
    linkTo: 'todo',
  },
  // todo: Do we want these, maybe on a large screen display???
  // tozer: { name: 'Tozer', linkTo: '/todo/speaker/id' },
  // ravenhill: { name: 'Ravenhill', linkTo: '/todo/speaker/id' },
  // sparks: { name: 'Sparks', linkTo: '/todo/speaker/id' },
  // wilkerson: { name: 'Wilkerson', linkTo: '/todo/speaker/id' },
  // chan: { name: 'Chan', linkTo: '/todo/speaker/id' },
  // poonen: { name: 'Poonen', linkTo: '/todo/speaker/id' },
  divide: { name: '|', linkTo: '' },
  about: { name: 'About', linkTo: 'about' },
  podcast: { name: 'Podcast', linkTo: 'todo' },
  topics: { name: 'Topics', linkTo: 'topics' },
  blog: { name: 'Blog', linkTo: 'todo' },
};

const BibleLinks: { [key: string]: PageLink } = {
  bible: { name: 'All Bibles', linkTo: 'todo' },
  bsb: { name: 'BSB', linkTo: 'todo' },
  kjv: { name: 'KJV', linkTo: 'todo' },
  web: { name: 'WEB', linkTo: 'todo' },
  ylt: { name: 'YLT', linkTo: 'todo' },
  divide: { name: '|', linkTo: '' },
  v1: { name: 'John 1:1', linkTo: 'todo' },
  v2: { name: 'John 3:16', linkTo: 'todo' },
  v3: { name: 'Proverbs 3:5', linkTo: 'todo' },
  v4: { name: 'Psalm 18:2', linkTo: 'todo' },
};

interface HeaderProps {
  sermon?: Sermon;
  contributor?: Contributor;
}

export const Header = ({ sermon, contributor }: HeaderProps) => {
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const darkModeHandler = (dark: boolean) => {
    setDark(dark);
    // Store the preference for future visits
    localStorage.setItem('si-dark-mode', dark ? 'dark' : 'light');

    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // On initial load, check system preference and localStorage
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const storedMode = localStorage.getItem('si-dark-mode');

    if (storedMode) {
      const dark = storedMode === 'dark';
      darkModeHandler(dark); // Use stored preference
    } else {
      darkModeHandler(prefersDarkMode); // Use system preference
    }
  }, []);

  return (
    <header className="flex flex-col">
      {/* Top navbar - logo, search bar, and site options */}
      <div className="relative flex w-full space-x-4 h-16 lg:h-24 py-2 px-4 items-center bg-si-main justify-between md:justify-normal">
        <Link to="/">
          <img
            className="w-24 lg:w-48 h-auto p-4 sm:p-1"
            src="/sermon-index.svg"
            alt="sermon-index"
          />
        </Link>
        <div
          className={`md:hidden ${
            showMobileSearch ? 'text-si-accent' : 'text-white'
          }`}
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        >
          <FaSearch />
        </div>
        <div className="hidden md:inline flex-1">
          <SermonSearch />
        </div>

        <div className="hidden md:block items-center justify-center text-si-light hover:cursor-pointer">
          <div
            className="px-3 text-white text-lg"
            onClick={() => darkModeHandler(!dark)}
          >
            {dark ? <IoSunny /> : <IoMoon />}
          </div>
        </div>
      </div>
      <div
        className={`${
          showMobileSearch ? 'visible' : 'hidden'
        } md:hidden absolute top-[67px] h-10 w-full px-2 bg-si-olive items-center justify-center`}
      >
        <SermonSearch />
      </div>
      <div className="flex items-center justify-center h-11 px-4 md:px-8 py-2 bg-si-olive">
        <div className="overflow-x-auto whitespace-nowrap w-full no-scrollbar">
          <div className="flex md:justify-center space-x-6 text-white text-xl">
            {Object.values(Links).map((link: PageLink) => {
              if (link.linkTo === '') {
                return <span key={link.name}>{link.name}</span>;
              }
              const active = location.pathname === `/${link.linkTo}`;
              return (
                <Link
                  className={`block capitalize ${
                    active ? 'text-si-accent' : ''
                  } hover:text-si-accent`}
                  key={link.name}
                  to={`/${link.linkTo}`}
                >
                  <span className="hidden xl:inline">{link.name}</span>
                  <span className="xl:hidden">
                    {hasContent(link.short) ? link.short : link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* Bible navbar */}
      <div className="flex items-center justify-center h-11 px-4 md:px-8 py-2 bg-si-light dark:bg-si-dark">
        <div className="overflow-x-auto whitespace-nowrap w-full no-scrollbar">
          <div className="flex md:justify-center space-x-6 text-lg">
            {Object.values(BibleLinks).map((link: PageLink) => {
              if (link.linkTo === '') {
                return <span key={link.name}>{link.name}</span>;
              }
              const active = location.pathname === `/${link.linkTo}`;
              return (
                <Link
                  className={`block capitalize ${
                    active ? 'text-si-accent' : ''
                  } hover:text-si-accent`}
                  key={link.name}
                  to={`/${link.linkTo}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* Third navbar - shortcuts */}
      <div className="border-b-2 border-si-gray dark:border-si-dim"></div>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        location={location.pathname}
        sermon={sermon}
        contributor={contributor}
      />
    </header>
  );
};
