import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { SearchModal } from './search-modal';
import { Sidebar } from './sidebar';

export const Navbar = () => {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const darkModeHandler = (dark: boolean) => {
    setDark(dark);
    // Store the preference for future visits
    localStorage.setItem('si-dark-mode', dark ? 'dark' : 'light');

    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // On initial load, check system preference and localStorage
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const storedMode = localStorage.getItem('si-dark-mode');

    if (storedMode) {
      const dark = storedMode === 'dark';
      darkModeHandler(dark); // Use stored preference
    } else {
      darkModeHandler(prefersDarkMode); // Use system preference
    }
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-si-main">
        <div className="px-2 md:px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <div
                className="flex md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <IconContext.Provider
                  value={{
                    className: 'w-7 h-7 text-white',
                  }}
                >
                  <HiOutlineMenuAlt2 />
                </IconContext.Provider>
              </div>
              <Link to="/" className="ml-3 md:ml-0">
                <img
                  className="w-40 md:w-48 h-auto items-center"
                  src="/sermon-index-white.png"
                  alt="sermon-index"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-2 md:space-x-8">
              <SearchModal />
              <div
                className="px-3 text-white text-lg"
                onClick={() => darkModeHandler(!dark)}
              >
                {dark ? <IoSunny /> : <IoMoon />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Sidebar sidebarOpen={sidebarOpen} />

      {sidebarOpen && (
        <div className="bg-neutral-600/60 dark:bg-neutral-500/60 fixed w-full h-screen z-20 top-0 left-0"></div>
      )}
    </>
  );
};
