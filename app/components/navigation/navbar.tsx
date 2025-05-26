import { Link } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { IconContext } from 'react-icons';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { SearchModal } from '../search-modal';
import { Sidebar } from './sidebar';
import { Topbar } from '~/components/navigation/topbar';

interface NavbarProps {
  onEffectiveHeightChange: (height: number) => void;
}

export const Navbar = ({ onEffectiveHeightChange }: NavbarProps) => {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);

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

  // Effect to set top of page
  useEffect(() => {
    const calculateAndReportHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        onEffectiveHeightChange(height);
      } else {
        onEffectiveHeightChange(0);
      }
    };
    calculateAndReportHeight();
    const observer = new ResizeObserver(calculateAndReportHeight);
    if (navRef.current) {
      observer.observe(navRef.current);
    }
    window.addEventListener('resize', calculateAndReportHeight);

    return () => {
      if (navRef.current) {
        observer.unobserve(navRef.current);
      }
      observer.disconnect();
      window.removeEventListener('resize', calculateAndReportHeight);
    };
  }, [onEffectiveHeightChange]);

  return (
    <>
      <nav ref={navRef} className="fixed top-0 z-50 w-full">
        <div className="bg-si-main px-2 xl:px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <div
                className="flex xl:hidden"
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
              <Link to="/" className="ml-3 xl:ml-0">
                <img
                  className="w-48 h-auto items-center"
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

        {/* Shows Topbar on md screens and larger */}
        <div className="xl:block hidden">
          <Topbar />
        </div>
      </nav>

      {/* Shows Sidebar on screens smaller than md */}
      <div className="xl:hidden">
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>
    </>
  );
};
