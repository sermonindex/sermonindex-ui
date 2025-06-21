import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import { FaBible } from 'react-icons/fa';
import { FaBlog, FaMusic } from 'react-icons/fa6';
import { GiBookshelf } from 'react-icons/gi';
import { ImBubbles } from 'react-icons/im';
import { IoInformationCircle, IoPersonSharp } from 'react-icons/io5';
import { PiBooksFill } from 'react-icons/pi';
import { RiFilePaper2Fill } from 'react-icons/ri';

export interface NavItem {
  name: string;
  icon: JSX.Element;
  linkTo: string;
  subItems?: Omit<NavItem, 'icon'>[];
}

export const mainNavItems: NavItem[] = [
  {
    name: 'Speakers',
    icon: <IoPersonSharp />,
    linkTo: '/speakers',
  },
  {
    name: 'Top 100',
    icon: <RiFilePaper2Fill />,
    linkTo: '/top-100',
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
  {
    name: 'Books',
    icon: <GiBookshelf />,
    linkTo: '/books',
  },
  {
    name: 'Topics',
    icon: <ImBubbles />,
    linkTo: '/topics',
  },
  {
    name: 'Songs',
    icon: <FaMusic />,
    linkTo: '/songs',
  },
];
export const secondaryNavItems: NavItem[] = [
  {
    name: 'Blog',
    icon: <FaBlog />,
    linkTo: '/blog',
  },
  {
    name: 'About',
    icon: <IoInformationCircle />,
    linkTo: '/md/about',
  },
];

export interface NavItemProps {
  item: NavItem;
  showIcon?: boolean;
  iconClassName?: string;
  linkClassName?: string;
  showSubItems?: boolean;
}

export const NavItemLi = ({
  item,
  showIcon = false,
  iconClassName = 'w-5 h-5 text-neutral-500 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
  linkClassName = 'flex items-center px-2 border-b-2 border-transparent hover:border-si-accent group',
  showSubItems = false,
}: NavItemProps) => {
  return (
    <>
      <Link to={item.linkTo} className={linkClassName}>
        {item.icon && showIcon && (
          <IconContext.Provider
            value={{
              className: iconClassName,
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
        <ul className="space-y-1 ml-7">
          {item.subItems.map((subItem, index) => (
            <li key={index}>
              <Link to={subItem.linkTo} className={`${linkClassName} pl-9`}>
                {subItem.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
