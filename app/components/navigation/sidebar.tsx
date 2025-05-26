import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import {
  mainNavItems,
  secondaryNavItems,
} from '~/components/navigation/nav-items';
import {
  navIconStyle,
  navItemStyle,
  secondaryNavbarStyle,
} from '~/components/navigation/nav-styles';

export interface SidebarProps {
  sidebarOpen: boolean;
}

export const Sidebar = ({ sidebarOpen }: SidebarProps) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${secondaryNavbarStyle} border-r`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {mainNavItems.map((item, index) => (
            <li key={index}>
              <Link to={item.linkTo} className={navItemStyle}>
                <IconContext.Provider
                  value={{
                    className: `${navIconStyle}`,
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
          {secondaryNavItems.map((item, index) => (
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
