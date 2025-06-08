import {
  mainNavItems,
  NavItem,
  NavItemLi,
  secondaryNavItems,
} from '~/components/navigation/nav-items';

export const Midbar = () => {
  const items = [...mainNavItems, ...secondaryNavItems];

  return (
    <nav className={`w-full bg-si-olive text-white text-xl`}>
      <div className="px-4 h-11 flex items-center justify-center">
        {topNavbarList(items)}
      </div>
    </nav>
  );
};

function topNavbarList(items: NavItem[]) {
  return (
    <ul className="flex flex-row space-x-1 xl:space-x-3">
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
