import { Link } from 'react-router-dom';
import { formatNumber } from '~/common/format-number';

export interface GenericListProps<T> {
  items: T[];
  getGroupedItems: (items: T[]) => { [key: string]: T[] };
  getGroupKeyName: (key: string) => string;
  getItemId: (item: T) => string;
  getItemName: (item: T) => string;
  getItemLink: (item: T) => string;
  getItemSubName?: (item: T) => string;
  getItemCount?: (item: T) => number;
  columnsClassName?: string;
  /**
   * Specifies the sort order for the groups.
   * 'asc' - Ascending order.
   * 'desc' - Descending order.
   * 'none' - The original order from getGroupedItems.
   * @default 'none'
   */
  sortOrder?: 'asc' | 'desc' | 'none';
}

// A generic list component that groups items into some hierarchy
export const GenericList = <T,>({
  items,
  getGroupedItems,
  getGroupKeyName,
  getItemId,
  getItemName,
  getItemLink,
  getItemSubName,
  getItemCount,
  columnsClassName = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  sortOrder = 'none',
}: GenericListProps<T>) => {
  const itemsGrouped = getGroupedItems(items);

  // Get the entries
  const groupedEntries = Object.entries(itemsGrouped);

  // Conditionally sort the groups based on the sortOrder prop
  if (sortOrder === 'asc') {
    groupedEntries.sort((a, b) => a[0].localeCompare(b[0]));
  } else if (sortOrder === 'desc') {
    groupedEntries.sort((a, b) => b[0].localeCompare(a[0]));
  }

  return (
    <div className="p-2">
      {groupedEntries.map(([key, group]) => {
        return (
          <div key={key}>
            <h2 className="text-lg pt-4 font-semibold capitalize border-neutral-200 dark:border-neutral-600 border-b-2">
              {getGroupKeyName(key)}
            </h2>
            <div key={key}>
              <ul className={`grid ${columnsClassName} gap-2 pt-2`}>
                {group.map((item) => (
                  <Link key={getItemId(item)} to={getItemLink(item)}>
                    <li
                      className="flex items-center justify-between min-h-10 px-2 py-1 text-sm rounded-lg hover:cursor-pointer bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-600 hover:dark:bg-neutral-700 break-inside-avoid-column"
                      key={getItemName(item)}
                    >
                      <div className="flex-grow">
                        {/* Wrapper for text content */}
                        <span>{getItemName(item)}</span>
                        {/* Conditionally render the sub-name if the function is provided */}
                        {getItemSubName && (
                          <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                            {getItemSubName(item)}
                          </span>
                        )}
                      </div>
                      {getItemCount && (
                        <span className="inline-flex items-center justify-center w-9 h-4 ms-2 text-xs text-black dark:text-white bg-neutral-300 dark:bg-neutral-700 rounded-full shrink-0">
                          {formatNumber(getItemCount(item))}
                        </span>
                      )}
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
