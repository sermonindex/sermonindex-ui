import { RiFilePaper2Fill } from 'react-icons/ri';
import { IoInformationCircle, IoPersonSharp } from 'react-icons/io5';
import { ImBubbles } from 'react-icons/im';
import { FaBible } from 'react-icons/fa';
import { PiBooksFill } from 'react-icons/pi';
import { FaBlog, FaMusic } from 'react-icons/fa6';
import { GiBookshelf } from 'react-icons/gi';
import { Link } from '@remix-run/react';
import { navItemStyle } from '~/components/navigation/nav-styles';
import { IconContext } from 'react-icons';

export interface NavItem {
  name: string;
  icon: JSX.Element;
  linkTo: string;
  subItems?: Omit<NavItem, 'icon'>[];
}

export const mainNavItems: NavItem[] = [
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
export const secondaryNavItems: NavItem[] = [
  {
    name: 'Blog',
    icon: <FaBlog />,
    linkTo: '/md/blog',
  },
  {
    name: 'About',
    icon: <IoInformationCircle />,
    linkTo: '/md/about',
  },
];

export interface NavItemProps {
  item: NavItem;
  index: number;
  showIcon?: boolean;
  showSubItems?: boolean;
}

export const NavItemLi = ({
  item,
  index,
  showIcon = false,
  showSubItems = false,
}: NavItemProps) => {
  return (
    <li key={index}>
      <Link
        to={item.linkTo}
        key={index}
        className="flex items-center px-2 py-1 rounded-lg hover:bg-si-official-light dark:hover:bg-si-official group"
      >
        {item.icon && showIcon && (
          <IconContext.Provider
            value={{
              className:
                'w-5 h-5 text-neutral-300 transition duration-75 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-white',
            }}
          >
            {item.icon}
          </IconContext.Provider>
        )}
        <span className={item.icon && showIcon ? 'ms-2 md:ms-3' : ''}>
          {item.name}
        </span>
      </Link>
      {item.subItems && showSubItems && (
        <ul key={`${item.name}-submenu`} className="space-y-1">
          {item.subItems.map((subItem, subIndex) => (
            <li key={`${item.name}-${subIndex}`}>
              <Link
                to={subItem.linkTo}
                key={subIndex}
                className="flex items-center w-full p-2 text-sm transition duration-75 rounded-lg pl-11 hover:bg-si-official-light dark:hover:bg-si-official group"
              >
                {subItem.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
