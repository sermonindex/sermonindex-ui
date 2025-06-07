import {
  mainNavItems,
  NavItemLi,
  secondaryNavItems,
} from '~/components/navigation/nav-items';

export interface SidebarProps {
  sidebarOpen: boolean;
}

export const Sidebar = ({ sidebarOpen }: SidebarProps) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-si-light border-r border-neutral-300 dark:bg-si-slate dark:border-neutral-700`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {mainNavItems.map((item, index) => (
            <NavItemLi
              item={item}
              index={index}
              showIcon={true}
              linkClassName={
                'flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600 group'
              }
              showSubItems={true}
            />
          ))}
        </ul>
        <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-neutral-200">
          {secondaryNavItems.map((item, index) => (
            <NavItemLi
              item={item}
              index={index}
              showIcon={true}
              linkClassName={
                'flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600 group'
              }
              showSubItems={false}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};
