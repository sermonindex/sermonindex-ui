import { Link } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { ListPaginatedResponse, MediaType, SermonInfo } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import DropdownCheckbox from './dropdown-checkbox';
import { InfiniteScroll } from './infinite-scroll';
import { SermonCard } from './sermon-card';
import { Spinner } from './spinner';

export interface SermonListProps {
  sermons: SermonInfo[];
  baseUrl?: string;
  filters?: Record<string, string | number | null | undefined> | null;
  nextPage?: number | null;
  showTopic?: boolean;
  showContributor?: boolean;
}

export const SermonList = ({
  sermons: initialSermons,
  baseUrl = '/sermons',
  filters = {},
  nextPage = null,
  showContributor,
}: SermonListProps) => {
  const [sermons, setSermons] = useState<SermonInfo[]>(initialSermons);
  const [title, setTitle] = useState<string>();
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>(
    Object.values(MediaType),
  );
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offsetRef = useRef<number | null>(nextPage);
  const initialRender = useRef(true);

  const setLoading = (loading: boolean, loadFirstPage: boolean) => {
    if (loadFirstPage) setLoadingAll(loading);
    else setLoadingMore(loading);
  };

  const fetchSermons = async (loadFirstPage: boolean = false) => {
    try {
      if (!loadFirstPage && offsetRef.current === null) {
        setLoading(false, loadFirstPage);
        return;
      }
      setLoading(true, loadFirstPage);

      const nextOffset = loadFirstPage ? 0 : offsetRef.current;
      const result = await fetchApi<ListPaginatedResponse<SermonInfo>>(
        baseUrl,
        {
          ...filters,
          title: title,
          mediaType: mediaTypes.join(','),
          offset: nextOffset,
          limit: 25,
        },
      );

      if ('statusCode' in result) {
        setError(result.message);
        setLoading(false, loadFirstPage);
        return;
      }

      offsetRef.current = result.nextPage;
      setSermons((prevSermons) =>
        loadFirstPage ? result.values : [...prevSermons, ...result.values],
      );
    } catch (error) {
      setError('Failed to load sermons');
    } finally {
      setLoading(false, loadFirstPage);
    }
  };

  useEffect(() => {
    if (initialRender.current) return;

    setLoadingAll(true);
    setSermons([]);

    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(() => fetchSermons(true), 750));
  }, [title, mediaTypes]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    setSermons(initialSermons);
  }, [initialSermons]);

  return (
    <div>
      <div className="flex items-center space-x-4">
        <input
          className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
          placeholder="Find a sermon..."
          onChange={(e) => setTitle(e.target.value.toLowerCase())}
          required
        />
        <DropdownCheckbox
          title="Filter Media"
          shortTitle="Filter"
          options={Object.values(MediaType)}
          onFilterChange={(options: string[]) =>
            setMediaTypes(options as MediaType[])
          }
        />
      </div>
      {/* TODO: Replace with <DynamicList/> */}
      {loadingAll && <Spinner />}
      {!loadingAll && (
        <InfiniteScroll
          fetchData={fetchSermons}
          loading={loadingMore}
          error={error}
        >
          <ul>
            {!!sermons.length &&
              sermons.map((sermon) => (
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
            {!sermons.length && (
              <li className="flex flex-col items-center justify-center h-36">
                <span className="text-neutral-500 dark:text-neutral-400">
                  No results found
                </span>
              </li>
            )}
          </ul>
        </InfiniteScroll>
      )}
    </div>
  );
};
