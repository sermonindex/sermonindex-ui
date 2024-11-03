import React from 'react';

interface SearchProps {
  placeholder: string;
  // Either on change or on submit should be defined
  onChange?: any; // todo: redefine as callable
  onSubmit?: any; // todo: redefine as callable
  parentStyle?: string;
  inputStyle?: string;
}

export const SearchBar: React.FC<SearchProps> = ({
  placeholder,
  onChange,
  onSubmit,
  parentStyle,
  inputStyle,
}) => {
  return (
    <div className={`relative flex flex-grow ${parentStyle}`}>
      <input
        className={`flex-grow bg-gray-50 text-gray-900 text-sm rounded-lg px-4 py-2 pr-10 ${inputStyle}`}
        placeholder={placeholder}
        onChange={(e) => {
          /* todo */
        }}
        required
      />
      {/* todo: only show submit button if onSubmit is defined */}
      <button
        type="submit"
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
