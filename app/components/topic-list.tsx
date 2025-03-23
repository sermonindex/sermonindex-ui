import { Link } from 'react-router-dom';
import { Topic } from '~/api/interfaces';

export interface TopicListProps {
  topics: Topic[];
}

// Note that the styling of the topic list is identical to that of the speaker list.
// these should probably use a single shared component or at least share the list styles.
export const TopicList = ({ topics }: TopicListProps) => {
  const group: { [key: string]: Topic[] } = {};

  const topicsGrouped = topics.reduce((grouped, topic) => {
    const letter = topic.name[0].toLowerCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(topic);
    return grouped;
  }, group);

  return (
    <div className="p-2">
      {Object.entries(topicsGrouped).map(([letter, group]) => {
        return (
          <div key={letter}>
            <h2 className="text-lg pt-4 font-semibold capitalize border-slate-600 border-b-2">
              {letter}
            </h2>
            <div
              key={letter}
              className="w-full pt-2 columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5"
            >
              <ul>
                {group.map((topic) => (
                  <Link key={topic.name} to={`/topics/${topic.slug}`}>
                    <li
                      className="group flex items-center h-8 text-sm justify-between pl-2 my-1 rounded-md hover:cursor-pointer hover:underline hover:bg-gray-300 dark:hover:bg-gray-700 break-inside-avoid-column"
                      key={topic.name}
                    >
                      <span>
                        {topic.name} ({topic.sermonCount})
                      </span>
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
