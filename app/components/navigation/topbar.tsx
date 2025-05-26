import {
  mainNavItems,
  navItem,
  secondaryNavItems,
} from '~/components/navigation/nav-items';
import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import {
  navIconStyle,
  navItemStyle,
  secondaryNavbarStyle,
} from '~/components/navigation/nav-styles';

export const Topbar = () => {
  return (
    <nav className={`w-full shadow-sm ${secondaryNavbarStyle} border-b`}>
      <div className="container mx-auto px-4 h-12 flex items-center justify-center gap-x-4">
        {/* Right side navigation items */}
        {topNavbarList(mainNavItems)}
        {/* Divider between left and right nav items */}
        <div className="border-l-2 h-6 border-neutral-300 dark:border-neutral-700" />
        {/* Left nav items */}
        {topNavbarList(secondaryNavItems)}
      </div>
    </nav>
  );
};

function topNavbarList(items: navItem[]) {
  return (
    <ul className="flex flex-row space-x-1 md:space-x-3">
      {items.map((item, index) => (
        <li key={index}>
          <Link to={item.linkTo} className={navItemStyle}>
            {item.icon && (
              <IconContext.Provider
                value={{
                  className: `${navIconStyle}`,
                }}
              >
                {item.icon}
              </IconContext.Provider>
            )}
            <span className={item.icon ? 'ms-2 md:ms-3' : ''}>{item.name}</span>
          </Link>
          {/* Sub-items logic is removed for this iteration - not sure how to handle these visually */}
        </li>
      ))}
    </ul>
  );
}
