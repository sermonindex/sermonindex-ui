import { Link, useLocation } from '@remix-run/react';
import { SearchBar } from '~/common/search-bar';
import React, { useState, useEffect } from 'react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import Breadcrumbs from '~/components/breadcrumbs';
import { Sermon } from '~/api/interfaces';

interface PageLink {
  name: string;
  linkTo: string;
  // todo: add screen size min to show (like sm, md, lg, xl)
  // todo: add smallText for sm,
  // todo: add largeText for lg, etc.
  // if no text for sm then it should not be shown on sm
}

const Links: { [key: string]: PageLink } = {
  speakers: { name: 'All Speakers', linkTo: 'speakers' },
  top100: { name: 'Top 100 Sermons', linkTo: 'top100' },
  recommended: { name: 'Recommended Sermons', linkTo: 'todo' },
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
  topics: { name: 'Topics', linkTo: 'todo' },
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
}

export const Header = ({ sermon }: HeaderProps) => {
  const location = useLocation();
  const [dark, setDark] = useState(false);

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
      <div className="flex h-28 px-8 bg-si-main items-center justify-between">
        <Link to="/">
          <div className="flex-shrink-0">
            <img
              className="h-24 min-w-full py-3 pr-8 object-contain"
              src="/sermon-index.svg"
              alt="sermon-index"
            />
          </div>
        </Link>
        <div className="flex flex-grow pl-8 pr-20">
          <SearchBar
            placeholder="Search Sermons..."
            inputStyle="border-2 border-si-olive"
          />
        </div>

        <div className="flex items-center justify-center text-si-light">
          <div className="px-3 text-white text-lg">
            <IoMoon />
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!dark}
              onChange={() => darkModeHandler(!dark)}
            />
            <div className="w-11 h-6 bg-white peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-si-main after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            <div className="px-3 text-white text-lg">
              <IoSunny />
            </div>
          </label>
        </div>
      </div>
      {/* Second navbar - page links */}
      <div className="flex px-8 bg-si-olive items-center justify-center py-2">
        <ul className="flex space-x-6 text-white text-xl">
          {Object.values(Links).map((link: PageLink) => {
            if (link.linkTo === '') {
              return (
                <span className="text-si-olive" key={link.name}>
                  {link.name}
                </span>
              );
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
        </ul>
      </div>
      {/* Bible navbar */}
      <div className="flex px-8 bg-si-light dark:bg-si-dark items-center justify-center py-2">
        <ul className="flex space-x-6 text-lg items-center">
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
        </ul>
      </div>
      {/* Third navbar - shortcuts */}
      <div className="border-b-2 border-si-gray dark:border-si-dim"></div>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs location={location.pathname} sermon={sermon} />
    </header>
  );
};
