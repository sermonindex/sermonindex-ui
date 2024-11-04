import { Link, useLocation } from '@remix-run/react';
import { SearchBar } from '~/common/search-bar';

const Pages = ['speakers', 'audio', 'video', 'text', 'about'];
const Shortcuts = ['bible', 'hymns', 'books', 'pictures'];

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
  top100: { name: 'Top 100 Sermons', linkTo: 'todo' },
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

export const Header = () => {
  const location = useLocation();

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
      </div>
      {/* Second navbar - page links */}
      <div className="flex px-8 bg-si-dark items-center justify-center py-2">
        <ul className="flex space-x-6 text-white text-lg">
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
                className={`block capitalize font-semibold ${
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
      <div className="flex px-8 bg-si-light items-center justify-center py-2">
        <ul className="flex space-x-6 text-si-dark items-center">
          {Object.values(BibleLinks).map((link: PageLink) => {
            if (link.linkTo === '') {
              return <span key={link.name}>{link.name}</span>;
            }
            const active = location.pathname === `/${link.linkTo}`;
            return (
              <Link
                className={`block capitalize font-semibold ${
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
      <div className="border-b-2 border-si-gray"></div>
      {/* todo: breadcrumbs...I need to think more about how this will work */}
      <div className="text-si-main text-sm p-2">{'> Home '}</div>
    </header>
  );
};
