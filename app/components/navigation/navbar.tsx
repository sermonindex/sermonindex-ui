import { Link } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { IconContext } from 'react-icons';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { BibleBar } from '~/components/navigation/bible-bar';
import { Midbar } from '~/components/navigation/mid-bar';
import { SearchModal } from '../search-modal';
import { Sidebar } from './sidebar';

interface NavbarProps {
  onEffectiveHeightChange: (height: number) => void;
}

export const Navbar = ({ onEffectiveHeightChange }: NavbarProps) => {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

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

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        hamburgerRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [sidebarOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="
        fixed top-0 left-0 right-0 z-50
        lg:relative lg:z-auto
        lg:border-b-2 lg:border-si-gray lg:dark:border-si-rock
        "
      >
        <div className="bg-si-main py-4 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between lg:p-2">
              <div
                className="flex lg:hidden"
                ref={hamburgerRef}
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
              <Link to="/" className="ml-3 lg:ml-0">
                <img
                  className="w-48 lg:w-60 h-auto items-center"
                  src="/sermon-index-white.png"
                  alt="sermon-index"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-8">
              <SearchModal />
              <div
                className="px-3 text-white text-lg lg:text-xl"
                onClick={() => darkModeHandler(!dark)}
              >
                {dark ? <IoSunny /> : <IoMoon />}
              </div>
            </div>
          </div>
        </div>

        {/* Shows Midbar on lg screens and larger */}
        <div className="lg:block hidden">
          <Midbar />
          <BibleBar />
        </div>
      </nav>

      {/* Shows Sidebar on screens smaller than lg */}
      <div className="lg:hidden">
        <Sidebar ref={sidebarRef} sidebarOpen={sidebarOpen} />
      </div>

      {sidebarOpen && (
        <div className="bg-neutral-600/60 dark:bg-neutral-500/60 fixed w-full h-screen z-20 top-0 left-0"></div>
      )}
    </>
  );
};
