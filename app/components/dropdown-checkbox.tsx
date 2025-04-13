import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6'; // Use fa6 for consistency

interface DropdownCheckboxProps {
  title: string;
  options: string[];
  onFilterChange: (options: string[]) => void;
}

const DropdownCheckbox: React.FC<DropdownCheckboxProps> = ({
  title,
  options,
  onFilterChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(options);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionsChange = (option: string) => {
    setSelectedOptions((prevSelected) => {
      let newOptions: string[];
      if (prevSelected.includes(option)) {
        newOptions = prevSelected.filter((m) => m !== option);
      } else {
        newOptions = [...prevSelected, option];
      }
      onFilterChange(newOptions);
      return newOptions;
    });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="relative inline-flex items-center justify-between min-w-[135px] p-3 rounded-lg text-black dark:text-white bg-neutral-200 dark:bg-neutral-600"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className="whitespace-nowrap pr-3 text-sm">{title}</span>{' '}
        {/* Prevent wrapping */}
        <div className="flex text-sm items-center justify-center">
          <FaChevronDown
            className={`${
              isOpen ? 'rotate-180' : ''
            } shrink-0 transition-transform duration-100`}
            aria-hidden="true"
          />
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 min-w-[135px] mt-2 origin-top-right rounded-md bg-neutral-200 dark:bg-neutral-600 shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none">
          <div className="py-1" role="none">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-neutral-300 hover:dark:bg-neutral-700"
                role="menuitem"
              >
                <div className="relative mr-2">
                  <input
                    type="checkbox"
                    className="opacity-0 absolute h-full w-full cursor-pointer"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionsChange(option)}
                  />
                  <span
                    className={`border rounded border-gray-300 w-4 h-4 flex items-center justify-center transition-colors duration-200 ${
                      selectedOptions.includes(option)
                        ? 'bg-neutral-500'
                        : 'bg-white'
                    }`}
                  >
                    {selectedOptions.includes(option) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </div>
                {option}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;
