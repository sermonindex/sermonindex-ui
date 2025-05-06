import { Link } from 'react-router-dom';
import { formatNumber } from '~/common/format-number';

export interface GenericListProps<T> {
  items: T[];
  getGroupedItems: (items: T[]) => { [key: string]: T[] };
  getGroupKeyName: (key: string) => string;
  getItemId: (item: T) => string;
  getItemName: (item: T) => string;
  getItemLink: (item: T) => string;
  getItemCount?: (item: T) => number;
  columnsClassName?: string;
}

// A generic list component that groups items into some hierarchy
export const GenericList = <T,>({
  items,
  getGroupedItems,
  getGroupKeyName,
  getItemId,
  getItemName,
  getItemLink,
  getItemCount,
  columnsClassName = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
}: GenericListProps<T>) => {
  const itemsGrouped = getGroupedItems(items);

  return (
    <div className="p-2">
      {Object.entries(itemsGrouped).map(([key, group]) => {
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
                      // TODO: Add hover effect in dark mode and maybe change color on featured speaker
                      className="flex items-center justify-between h-10 px-2 text-sm rounded-lg hover:cursor-pointer bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-600 hover:dark:bg-neutral-700 break-inside-avoid-column"
                      key={getItemName(item)}
                    >
                      <span>{getItemName(item)}</span>
                      {getItemCount && (
                        <span className="inline-flex items-center justify-center w-9 h-4 ms-2 text-xs text-black dark:text-white bg-neutral-300 dark:bg-neutral-700 rounded-full">
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
