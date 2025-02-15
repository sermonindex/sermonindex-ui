import { Link } from 'react-router-dom';

export interface GenericListProps<T> {
  items: T[];
  getGroupedItems: (items: T[]) => { [key: string]: T[] };
  getGroupKeyName: (key: string) => string;
  getItemId: (item: T) => string;
  getItemName: (item: T) => string;
  getItemLink: (item: T) => string;
  columnClasses?: string;
}

// A generic list component that groups items into some hierarchy
export const GenericList = <T,>({
  items,
  getGroupedItems,
  getGroupKeyName,
  getItemId,
  getItemName,
  getItemLink,
  columnClasses = 'w-full pt-2 columns-1 md:columns-2 xl:columns-3',
}: GenericListProps<T>) => {
  const itemsGrouped = getGroupedItems(items);

  return (
    <div className="p-2">
      {Object.entries(itemsGrouped).map(([key, group]) => {
        return (
          <div key={key}>
            <h2 className="text-lg pt-4 font-semibold capitalize border-slate-600 border-b-2">
              {getGroupKeyName(key)}
            </h2>
            <div key={key} className={columnClasses}>
              <ul>
                {group.map((item) => (
                  <Link key={getItemId(item)} to={getItemLink(item)}>
                    <li
                      className="group flex items-center h-10 text-sm justify-between pl-2 my-1 rounded-md hover:cursor-pointer hover:underline hover:bg-gray-300 dark:hover:bg-gray-700 break-inside-avoid-column"
                      key={getItemName(item)}
                    >
                      <span>{getItemName(item)}</span>
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
