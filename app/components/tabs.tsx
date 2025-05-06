import { useLocation } from '@remix-run/react';

export interface TabListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  title: string;
  active?: boolean;
  tabStyle?: 'underline' | 'pill';
}
export interface TabListProps {
  children?: React.ReactNode;
  tabStyle?: 'underline' | 'pill';
}
export interface TabContainerProps {
  children?: React.ReactNode;
}
export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  children?: React.ReactNode;
}

export const TabListItem = ({
  title,
  active,
  tabStyle = 'underline',
  ...props
}: TabListItemProps) => {
  // TODO: Anchor the active tab to the current location
  const location = useLocation();

  const activeStyles =
    tabStyle === 'underline'
      ? 'text-si-main border-si-main dark:text-si-brown dark:border-si-brown'
      : 'rounded-xl text-black dark:text-white bg-neutral-200 dark:bg-neutral-600';
  const inactiveStyles =
    tabStyle === 'underline'
      ? 'border-transparent text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-300'
      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300';
  const defaultStyles =
    tabStyle === 'underline'
      ? 'inline-block hover:cursor-pointer p-3 md:p-4 border-b-2 rounded-t-lg min-w-20 md:min-w-28'
      : 'inline-block hover:cursor-pointer py-2 px-2 md:py-3 md:px-4';

  return (
    <li
      className={`${defaultStyles} ${active ? activeStyles : inactiveStyles}`}
      {...props}
    >
      {title}
    </li>
  );
};

export const TabList = ({ children, tabStyle = 'underline' }: TabListProps) => {
  const style =
    tabStyle === 'underline'
      ? 'text-sm md:text-base font-semibold border-b border-neutral-200 dark:border-neutral-700'
      : 'text-sm';

  return (
    <div className={`flex text-center ${style}`}>
      <ul className="flex flex-wrap transition-all duration-300 overflow-hidden">
        {children}
      </ul>
    </div>
  );
};

export const TabContainer = ({ children }: TabContainerProps) => {
  return <div className="m-2">{children}</div>;
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
