import { Link } from "react-router-dom";
import { Contributor } from "~/api/interfaces";

export interface SpeakerListProps {
  contributors: Contributor[];
}

export const SpeakerList = ({ contributors }: SpeakerListProps) => {
  const group: { [key: string]: Contributor[] } = {};

  const contributorsGrouped = contributors.reduce((grouped, contributor) => {
    const letter = contributor.fullName[0].toLowerCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(contributor);
    return grouped;
  }, group);

  return (
    <div className="p-2">
      {Object.entries(contributorsGrouped).map(([letter, group]) => {
        return (
          <div key={letter} className="flex flex-col w-full">
            <h2 className="text-lg font-semibold capitalize text-slate-800 border-slate-600 border-b-2">
              {letter}
            </h2>
            <ul>
              {group.map((contributor) => (
                <Link
                  to={`/speakers/${contributor.fullName
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  <li
                    className="group flex items-center justify-between min-h-10 pl-2 my-1 text-md rounded-md text-slate-700 hover:cursor-pointer hover:underline hover:bg-gray-300"
                    key={contributor.fullName}
                  >
                    <span>{contributor.fullName}</span>
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
        );
      })}
    </div>
  );
};
