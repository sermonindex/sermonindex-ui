import { Link } from '@remix-run/react';
import { LiaWeebly } from 'react-icons/lia';
import { PiLinktreeLogo } from 'react-icons/pi';
import {
  RiBloggerLine,
  RiFacebookLine,
  RiFlickrLine,
  RiGithubLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiMediumLine,
  RiPatreonLine,
  RiPinterestLine,
  RiSoundcloudLine,
  RiThreadsLine,
  RiTiktokLine,
  RiTumblrLine,
  RiTwitterXLine,
  RiVimeoLine,
  RiYoutubeLine,
} from 'react-icons/ri';
import { SI_API_URL } from '~/api/sdk';

interface FooterAboutLink {
  name: string;
  linkTo: string;
}

const AboutLinks: { [key: string]: FooterAboutLink } = {
  about: { name: 'About Us', linkTo: '/md/about' },
  contact: { name: 'Contact', linkTo: '/md/contact' },
  api: {
    name: 'API',
    linkTo: `${SI_API_URL}/api`,
  },
  commendations: { name: 'Commendations', linkTo: '/md/commendations' },
  support: { name: 'Support', linkTo: '/md/support' },
  brand: { name: 'Brand Guidelines', linkTo: '/md/brand-guidelines' },
  copying: { name: 'Copying Permissions', linkTo: '/md/copying-permissions' },
  privacy: { name: 'Privacy Policy', linkTo: '/md/privacy-policy' },
  oss: { name: 'OSS Disclosure', linkTo: '/md/oss-disclosure' },
};

export const Footer = () => {
  return (
    <footer className="flex flex-col pt-4 md:pt-8">
      <div className="h-8 bg-si-olive border-t-2 border-si-gray dark:border-si-rock"></div>
      <div className="bg-si-dark p-4 dark:bg-gradient-to-t dark:from-black/40">
        <div className="mx-10">
          <div className="flex flex-col space-y-4 gap-x-6 md:space-y-0 md:flex-row md:justify-between py-4">
            <div className="flex flex-col text-wrap text-lg font-bold text-white">
              Everything we make is available for free because of a generous
              community of supporters.
            </div>
            <div className="flex flex-col">
              <Link
                key={'support-si-footer'}
                to={'/md/support'}
                className="bg-si-accent text-si-dark px-4 py-2 rounded-lg justify-center text-center"
              >
                Support SermonIndex
              </Link>
            </div>
          </div>

          <hr className="my-2 border-si-olive" />
          {/* About Column */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between py-4">
            <div className="flex flex-col">
              <h3 className="text-si-light text-lg font-bold">About</h3>
              <ul className="text-si-light text-md">
                {Object.values(AboutLinks).map((link: FooterAboutLink) => {
                  return (
                    <Link
                      className={`block capitalize hover:text-si-accent`}
                      key={link.name}
                      to={link.linkTo}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </ul>
            </div>
            {/* Follow, Social Media Column */}
            <div className="flex-1 flex flex-col md:px-4 md:text-center">
              <h3 className="text-si-light text-lg font-bold">Follow</h3>
              <ul className="grid grid-cols-6 gap-2 md:gap-3 md:mx-auto text-si-light text-sm pt-1 md:pt-4 md:justify-center">
                <a
                  href="https://www.facebook.com/search/top?q=sermonindex.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <RiFacebookLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://x.com/SermonIndex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <RiTwitterXLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://www.instagram.com/sermonindexnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <RiInstagramLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://ca.pinterest.com/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                >
                  <RiPinterestLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://www.youtube.com/@sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Youtube"
                >
                  <RiYoutubeLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://www.tiktok.com/@sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <RiTiktokLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://www.threads.net/@sermonindexnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Threads"
                >
                  <RiThreadsLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://soundcloud.com/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Soundcloud"
                >
                  <RiSoundcloudLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://vimeo.com/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Vimeo"
                >
                  <RiVimeoLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://github.com/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Github"
                >
                  <RiGithubLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://www.tumblr.com/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Tumblr"
                >
                  <RiTumblrLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://medium.com/@sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Medium"
                >
                  <RiMediumLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://www.patreon.com/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Patreon"
                >
                  <RiPatreonLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://www.flickr.com/photos/sermonindexnet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Flickr"
                >
                  <RiFlickrLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://linkedin.com/company/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Linkedin"
                >
                  <RiLinkedinLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://sermonindex.blogspot.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Blogspot"
                >
                  <RiBloggerLine className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://sermonindexnet.weebly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Weebly"
                >
                  <LiaWeebly className="text-si-light size-6 md:size-8" />
                </a>
                <a
                  href="https://linktr.ee/sermonindex"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Linktree"
                >
                  <PiLinktreeLogo className="text-si-light size-6 md:size-8" />
                </a>
              </ul>
            </div>
            {/* Quote (Only shown if the screen size is medium or larger */}
            <div className="flex-1 flex-col relative text-si-light text-center hidden md:block">
              <img
                src="https://sermonindex3.b-cdn.net/si-images/wesley-bg.png"
                alt="Wesley Quote"
                className="w-3/4 h-auto ml-auto pb-3"
                loading="lazy"
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
