import { Link } from 'react-router-dom';
import { BibleTranslation } from '~/api/interfaces';
import { getLanguageName } from '~/common/languages';

export interface BibleListProps {
  bibles: BibleTranslation[];
}

// Note that the styling of the topic list is identical to that of the speaker list.
// these should probably use a single shared component or at least share the list styles.
export const BibleList = ({ bibles }: BibleListProps) => {
  const group: { [key: string]: BibleTranslation[] } = {};

  const biblesGrouped = bibles.reduce((grouped, bible) => {
    const language = bible.language.toLowerCase();
    if (!grouped[language]) {
      grouped[language] = [];
    }
    grouped[language].push(bible);
    return grouped;
  }, group);

  return (
    <div className="p-2">
      {Object.entries(biblesGrouped).map(([language, group]) => {
        return (
          <div key={language}>
            <h2 className="text-lg pt-4 font-semibold capitalize border-slate-600 border-b-2">
              {getLanguageName(language)}
            </h2>
            <div
              key={language}
              className="w-full pt-2 columns-1 md:columns-2 xl:columns-3"
            >
              <ul>
                {group.map((bible) => (
                  <Link
                    key={bible.id}
                    to={`/bible/${bible.language}/${bible.shortName}`}
                  >
                    <li
                      className="group flex items-center h-10 text-sm justify-between pl-2 my-1 rounded-md hover:cursor-pointer hover:underline hover:bg-gray-300 dark:hover:bg-gray-700 break-inside-avoid-column"
                      key={bible.name}
                    >
                      <span>{bible.name}</span>
                      <span className="hidden group-hover:block transition-opacity duration-300">
                        <svg
                          className="h-6 w-6 text-slate-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};
