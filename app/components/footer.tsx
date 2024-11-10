import {
  RiFacebookLine,
  RiInstagramLine,
  RiPinterestLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from 'react-icons/ri';
import { Link } from '@remix-run/react';

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
    <footer className="flexflex-col pt-10">
      <div className="h-8 bg-si-olive border-t-2 border-si-gray dark:border-si-dim"></div>
      <div className="bg-si-dark p-4">
        <div className="mx-10">
          <div className="flex flex-row justify-between py-4">
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
          <div className="flex flex-row justify-between py-4">
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
            <div className="flex flex-col">
              <h3 className="text-si-light text-lg font-bold">Follow</h3>
              <ul className="flex flex-row text-si-light text-sm space-x-2 pt-2">
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
            {/* Subscribe Column */}
            <div className="flex flex-col">
              <h3 className="text-si-light text-lg font-bold">
                Receive Updates
              </h3>
              <div className="text-si-light text-sm py-2">
                {/* input and button to subscribe by email */}
                <div className="flex flex-col">
                  <input
                    className="border-2 border-si-olive bg-si-dark text-si-light text-sm rounded-lg px-4 py-2"
                    placeholder="Email Address"
                  />
                  <div className="py-2 flex">
                    {/* todo: grab input and submit this somewhere - do we need some backoff to prevent this getting hammered? */}
                    <button className="flex-grow border-2 border-si-olive text-si-light text-sm px-4 py-2 rounded-lg">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-si-tan text-sm py-4">
            © {Math.max(new Date().getFullYear(), 2024)} SermonIndex
          </p>
        </div>
      </div>
    </footer>
  );
};
