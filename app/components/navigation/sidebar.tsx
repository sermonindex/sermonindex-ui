import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import {
  mainNavItems,
  NavItemLi,
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
            <NavItemLi
              item={item}
              index={index}
              showIcon={true}
              showSubItems={true}
            />
          ))}
        </ul>
        <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-neutral-200 dark:border-neutral-700">
          {secondaryNavItems.map((item, index) => (
            <NavItemLi
              item={item}
              index={index}
              showIcon={true}
              showSubItems={false}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};
