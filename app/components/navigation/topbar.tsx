import {
  mainNavItems,
  NavItem,
  NavItemLi,
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
    <nav
      className={`w-full shadow-2xl ${secondaryNavbarStyle} border-b-2 border-si-gray dark:border-si-rock`}
    >
      <div className="container mx-auto px-4 h-12 flex items-center justify-center gap-x-4">
        {topNavbarList(mainNavItems)}
        {topNavbarList(secondaryNavItems)}
      </div>
    </nav>
  );
};

function topNavbarList(items: NavItem[]) {
  return (
    <ul className="flex flex-row space-x-1 md:space-x-3">
      {items.map((item, index) => (
        <NavItemLi
          item={item}
          index={index}
          showIcon={false}
          showSubItems={false}
        />
      ))}
    </ul>
  );
}
