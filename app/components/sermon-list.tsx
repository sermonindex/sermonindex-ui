import { Link } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { MediaType, SermonInfo } from '~/api/interfaces';
import DropdownCheckbox from './dropdown-checkbox';
import { DynamicList } from './dynamic-list';
import { SermonCard } from './sermon-card';

export interface SermonListProps {
  sermons: SermonInfo[];
  baseUrl?: string;
  filters?: Record<string, string | number | null | undefined> | null;
  nextPage?: number | null;
  showTopic?: boolean;
  showContributor?: boolean;
  showSearch?: boolean;
}

export const SermonList = ({
  sermons,
  baseUrl = '/sermons',
  filters = {},
  nextPage = null,
  showContributor,
  showSearch = true,
}: SermonListProps) => {
  const [title, setTitle] = useState<string>();
  const [mediaType, setMediaType] = useState<MediaType[]>(
    Object.values(MediaType),
  );

  const memoizedFilters = useMemo(() => {
    return { ...filters, title, mediaType: mediaType.join(',') };
  }, [title, mediaType]);

  return (
    <div>
      <div
        className={`${showSearch ? 'flex' : 'hidden'} items-center space-x-4`}
      >
        <input
          className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
          placeholder="Find a sermon..."
          type="search"
          name="search sermons"
          onChange={(e) => setTitle(e.target.value.toLowerCase())}
          required
        />
        <DropdownCheckbox
          title="Filter Media"
          shortTitle="Filter"
          options={Object.values(MediaType)}
          onFilterChange={(options: string[]) =>
            setMediaType(options as MediaType[])
          }
        />
      </div>
      <DynamicList
        items={sermons}
        baseUrl={baseUrl}
        filters={memoizedFilters}
        nextPage={nextPage}
        renderItems={(items) => (
          <ul>
            {items.map((sermon) => (
              <Link to={`/sermons/${sermon.id}`} key={sermon.id}>
                <li className="pb-2 md:pb-4" key={sermon.id}>
                  <SermonCard
                    sermon={sermon}
                    showContributor={showContributor}
                    showMediaPlayer={false}
                    className="hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200 ease-in-out"
                  />
                </li>
              </Link>
            ))}
          </ul>
        )}
      />
    </div>
  );
};
