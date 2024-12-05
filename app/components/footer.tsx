import { Link } from '@remix-run/react';
import {
  RiFacebookLine,
  RiInstagramLine,
  RiPinterestLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from 'react-icons/ri';

interface FooterAboutLink {
  name: string;
  linkTo: string;
}

const AboutLinks: { [key: string]: FooterAboutLink } = {
  about: { name: 'About Us', linkTo: 'about' },
  commendations: { name: 'Commendations', linkTo: 'todo' },
  support: { name: 'Get Support', linkTo: 'todo' },
  brand: { name: 'Brand Guidelines', linkTo: 'todo' },
  copying: { name: 'Copying Permissions', linkTo: 'todo' },
  privacy: { name: 'Privacy Policy', linkTo: 'todo' },
};

export const Footer = () => {
  return (
    <footer className="flex flex-col pt-10">
      <div className="h-8 bg-si-olive border-t-2 border-si-gray dark:border-si-dim"></div>
      <div className="bg-si-dark p-4">
        <div className="mx-10">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between py-4">
            <div className="flex flex-col text-wrap text-lg font-bold text-white">
              Everything we make is available for free because of a generous
              community of supporters.
            </div>
            <div className="flex flex-col">
              {/* todo: what does clicking this button do? */}
              <button className="bg-si-accent text-si-dark px-4 py-2 rounded-lg">
                Support SermonIndex
              </button>
            </div>
          </div>

          <hr className="my-2 border-si-olive" />
          {/* About Column */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between py-4">
            <div className="flex flex-col">
              <h3 className="text-si-light text-lg font-bold">About</h3>
              <ul className="text-si-light text-sm">
                {Object.values(AboutLinks).map((link: FooterAboutLink) => {
                  return (
                    <Link
                      className={`block capitalize hover:text-si-accent`}
                      key={link.name}
                      to={`/${link.linkTo}`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </ul>
            </div>
            {/* Follow, Social Media Column */}
            <div className="flex-1 flex flex-col px-4 text-center">
              <h3 className="text-si-light text-lg font-bold">Follow</h3>
              <ul className="flex flex-row text-si-light text-sm space-x-2 pt-2 justify-center">
                <a
                  href="https://www.facebook.com/search/top?q=sermonindex.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <RiFacebookLine className="text-si-light size-6" />
                </a>
                <a
                  href="https://x.com/SermonIndex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <RiTwitterXLine className="text-si-light size-6" />
                </a>
                <a
                  href="https://www.instagram.com/sermonindexnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <RiInstagramLine className="text-si-light size-6" />
                </a>
                <a
                  href="https://ca.pinterest.com/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                >
                  <RiPinterestLine className="text-si-light size-6" />
                </a>
                <a
                  href="https://www.youtube.com/@sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Youtube"
                >
                  <RiYoutubeLine className="text-si-light size-6" />
                </a>
              </ul>
            </div>
            {/* Quote (Only shown if the screen size is medium or larger */}
            <div className="flex-1 flex-col relative text-si-light text-center hidden md:block">
              <img
                src="/wesley-bg.png"
                alt="Wesley Quote"
                className="w-3/4 h-auto ml-auto pb-3"
              />
              <div className="bg-si-olive bg-opacity-10 rounded-lg shadow-2xl">
                <h2 className="text-md font-bold text-balance px-2 pt-2">
                  “God grant that I may never live to be useless!”
                </h2>
                <p className="text-xs font-bold italic text-center px-2 py-2">
                  John Wesley
                </p>
              </div>
            </div>
          </div>
          <p className="text-si-tan text-sm py-4 text-center">
            © {Math.max(new Date().getFullYear(), 2024)} SermonIndex
          </p>
        </div>
      </div>
    </footer>
  );
};
