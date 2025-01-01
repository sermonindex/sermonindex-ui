import { useLocation } from '@remix-run/react';

export interface TabListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  title: string;
  active?: boolean;
}
export interface TabListProps {
  children?: React.ReactNode;
}
export interface TabContainerProps {
  children?: React.ReactNode;
}
export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  children?: React.ReactNode;
}

export const TabListItem = ({ title, active, ...props }: TabListItemProps) => {
  // TODO: Anchor the active tab to the current location
  const location = useLocation();

  const activeStyles =
    'rounded-xl text-black dark:text-white bg-si-gray dark:bg-si-main';
  const inactiveStyles = 'text-gray-500';
  const defaultStyles =
    'inline-block py-3 px-6 font-medium hover:cursor-pointer hover:text-gray-800 dark:hover:text-gray-300';

  return (
    <li
      className={`${defaultStyles} ${active ? activeStyles : inactiveStyles}`}
      {...props}
    >
      {title}
    </li>
  );
};

export const TabList = ({ children }: TabListProps) => {
  return (
    <div className="flex">
      <ul className="flex flex-wrap transition-all duration-300 overflow-hidden">
        {children}
      </ul>
    </div>
  );
};

export const TabContainer = ({ children }: TabContainerProps) => {
  return <div className="mt-5">{children}</div>;
};
export const TabContent = ({
  children,
  active,
  className = '',
  ...props
}: TabContentProps) => {
  return (
    <div className={`${className} ${active ? '' : 'hidden'}`} {...props}>
      {children}
    </div>
  );
};
