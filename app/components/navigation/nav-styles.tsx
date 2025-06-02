const navbarColors = 'bg-si-olive'; // /80 backdrop-blur-md dark:bg-si-slate/60
const navbarBorders = 'border-neutral-300 dark:border-neutral-700';
// const navbarText = 'text-neutral-900 dark:text-white font-medium';
const navbarText = 'text-white text-xl font-medium tracking-wide';

export const navItemStyle =
  'flex items-center p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 group';
// export const navIconStyle =
//   'w-5 h-5 text-neutral-500 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white';
export const navIconStyle =
  'w-5 h-5 text-neutral-300 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white';
export const secondaryNavbarStyle = `${navbarColors} ${navbarBorders} ${navbarText}`;
