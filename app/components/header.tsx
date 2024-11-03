import { Link, useLocation } from '@remix-run/react';

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
  speakers: { name: 'Speakers', linkTo: 'speakers' },
  top100: { name: 'Top 100', linkTo: 'top-100' },
  recommended: { name: 'Recommended', linkTo: 'recommended' },
  // todo: Do we want these, maybe on a large screen display???
  // tozer: { name: 'Tozer', linkTo: '/todo/speaker/id' },
  // ravenhill: { name: 'Ravenhill', linkTo: '/todo/speaker/id' },
  // sparks: { name: 'Sparks', linkTo: '/todo/speaker/id' },
  // wilkerson: { name: 'Wilkerson', linkTo: '/todo/speaker/id' },
  // chan: { name: 'Chan', linkTo: '/todo/speaker/id' },
  // poonen: { name: 'Poonen', linkTo: '/todo/speaker/id' },
  divide: { name: '|', linkTo: '' },
  about: { name: 'About', linkTo: 'about' },
  podcast: { name: 'Podcast', linkTo: 'podcast' },
  topics: { name: 'Topics', linkTo: 'topics' },
  blog: { name: 'Blog', linkTo: 'blog' },
};

export const Header = () => {
  const location = useLocation();

  return (
    <header className="flex flex-col">
      {/* Top navbar - logo, search bar, and site options */}
      <div className="flex px-8 bg-si-main items-center justify-between">
        <Link to="/">
          <div className="flex-shrink-0">
            <img
              className="h-20 min-w-full py-3 pr-8 object-contain"
              src="/sermon-index.svg"
              alt="sermon-index"
            />
          </div>
        </Link>
        <div className="flex flex-grow pl-10 pr-20">
          {/* Todo: Bust out this search bar into a shared component */}
          <div className="relative flex flex-grow">
            <input
              className="flex-grow bg-gray-50 text-gray-900 text-sm rounded-lg px-4 py-2 pr-10"
              placeholder="Search SermonIndex..."
              onChange={(e) => {
                /* todo */
              }}
              required
            />
            <button
              type="submit"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Second navbar - page links */}
      <div className="flex px-8 bg-si-olive items-center justify-center py-1">
        <ul className="flex space-x-6">
          {Object.values(Links).map((link: PageLink) => {
            if (link.linkTo === '') {
              return <span key={link.name}>{link.name}</span>;
            }
            console.log(location.pathname, link.linkTo);
            const active = location.pathname === `/${link.linkTo}`;
            return (
              <Link
                className={`block capitalize text-white ${
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
    </header>
  );
};
