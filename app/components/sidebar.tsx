import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import { FaBible, FaMailBulk } from 'react-icons/fa';
import { ImBubbles } from 'react-icons/im';
import { IoInformationCircle, IoPersonSharp } from 'react-icons/io5';
import { PiBooksFill } from 'react-icons/pi';
import { RiFilePaper2Fill } from 'react-icons/ri';
import { SiSwagger } from 'react-icons/si';

interface SidebarItem {
  name: string;
  icon: JSX.Element;
  linkTo: string;
  subItems?: Omit<SidebarItem, 'icon'>[];
}

const mainSidebarItems: SidebarItem[] = [
  {
    name: 'Sermons',
    icon: <RiFilePaper2Fill />,
    linkTo: '/sermons',
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

const secondarySidebarItems: SidebarItem[] = [
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

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export const Sidebar = ({ sidebarOpen }: SidebarProps) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } bg-si-light border-r border-neutral-300 dark:bg-si-slate dark:border-neutral-700`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-si-light dark:bg-si-slate">
        <ul className="space-y-2 font-medium">
          {mainSidebarItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.linkTo}
                className={`flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600 group`}
              >
                <IconContext.Provider
                  value={{
                    className:
                      'w-5 h-5 text-neutral-500 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                  }}
                >
                  {item.icon}
                </IconContext.Provider>
                <span className="ms-3">{item.name}</span>
              </Link>
              {item.subItems && (
                <ul key={`${item.name}-submenu`} className="space-y-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={subItem.linkTo}
                        className="flex items-center w-full p-2 text-sm text-neutral-900 transition duration-75 rounded-lg pl-11 group hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-600"
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-neutral-200 dark:border-neutral-700">
          {secondarySidebarItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.linkTo}
                className={`flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600 group`}
              >
                <IconContext.Provider
                  value={{
                    className:
                      'w-5 h-5 text-neutral-500 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                  }}
                >
                  {item.icon}
                </IconContext.Provider>
                <span className="ms-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
