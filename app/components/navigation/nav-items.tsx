import { RiFilePaper2Fill } from 'react-icons/ri';
import { IoInformationCircle, IoPersonSharp } from 'react-icons/io5';
import { ImBubbles } from 'react-icons/im';
import { FaBible, FaMailBulk } from 'react-icons/fa';
import { PiBooksFill } from 'react-icons/pi';
import { SiSwagger } from 'react-icons/si';
import { FaBlog, FaMusic } from 'react-icons/fa6';
import { GiBookshelf } from 'react-icons/gi';

export interface navItem {
  name: string;
  icon: JSX.Element;
  linkTo: string;
  subItems?: Omit<navItem, 'icon'>[];
}

export const mainNavItems: navItem[] = [
  {
    name: 'Sermons',
    icon: <RiFilePaper2Fill />,
    linkTo: '/top-100',
  },
  {
    name: 'Speakers',
    icon: <IoPersonSharp />,
    linkTo: '/speakers',
  },
  {
    name: 'Topics',
    icon: <ImBubbles />,
    linkTo: '/topics',
  },
  {
    name: 'Books',
    icon: <GiBookshelf />,
    linkTo: '/books',
  },
  {
    name: 'Songs',
    icon: <FaMusic />,
    linkTo: '/songs',
  },
  {
    name: 'Bible',
    icon: <FaBible />,
    linkTo: '/bible',
    subItems: [
      {
        name: 'Berean Standard',
        linkTo: '/bible/eng/BSB',
      },
      {
        name: 'King James',
        linkTo: '/bible/eng/KJV',
      },
      {
        name: 'World English',
        linkTo: '/bible/eng/WEBP',
      },
    ],
  },
  {
    name: 'Commentary',
    icon: <PiBooksFill />,
    linkTo: '/commentary',
    // TODO: Add subitems for a few popular commentaries
  },
];
export const secondaryNavItems: navItem[] = [
  {
    name: 'Blog',
    icon: <FaBlog />,
    linkTo: '/md/blog',
  },
  {
    name: 'Api',
    icon: <SiSwagger />,
    linkTo: 'http://localhost:3000/api',
  },
  {
    name: 'About',
    icon: <IoInformationCircle />,
    linkTo: '/md/about',
  },
  {
    name: 'Contact',
    icon: <FaMailBulk />,
    linkTo: '/md/contact',
  },
];
