import { useEffect, useRef, useState } from 'react';
import { ListPaginatedResponse } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { InfiniteScroll } from './infinite-scroll';
import { Spinner } from './spinner';

export interface DynamicListProps<T> {
  items: T[];
  baseUrl: string;
  filters?: Record<string, string | number | null | undefined> | null;
  nextPage?: number | null;
  limit?: number | null;
  renderItems?: (items: T[]) => JSX.Element;
}

export const DynamicList = <T,>({
  items: initialItems,
  baseUrl,
  filters = {},
  nextPage = null,
  limit = 25,
  renderItems = (_: T[]) => <></>,
}: DynamicListProps<T>) => {
  const [items, setItems] = useState<T[]>(initialItems);
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

  const fetchItems = async (loadFirstPage: boolean = false) => {
    try {
      if (!loadFirstPage && offsetRef.current === null) {
        setLoading(false, loadFirstPage);
        return;
      }
      setLoading(true, loadFirstPage);

      const nextOffset = loadFirstPage ? 0 : offsetRef.current;
      const result = await fetchApi<ListPaginatedResponse<T>>(baseUrl, {
        ...filters,
        offset: nextOffset,
        limit,
      });

      if ('statusCode' in result) {
        setError(result.message);
        setLoading(false, loadFirstPage);
        return;
      }

      offsetRef.current = result.nextPage;
      setItems((prevItems) =>
        loadFirstPage ? result.values : [...prevItems, ...result.values],
      );
    } catch (error) {
      setError('Failed to load items. Please try again later.');
    } finally {
      setLoading(false, loadFirstPage);
    }
  };

  useEffect(() => {
    if (initialRender.current) return;

    setLoadingAll(true);
    setItems([]);

    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(() => fetchItems(true), 750));
  }, [filters]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    setItems(initialItems);
  }, [initialItems]);

  return (
    <div>
      {loadingAll && <Spinner />}
      {!loadingAll && (
        <InfiniteScroll
          fetchData={fetchItems}
          loading={loadingMore}
          error={error}
        >
          {!!items.length && renderItems(items)}
          {!items.length && (
            <div className="flex flex-col items-center justify-center h-36">
              <span className="text-neutral-500 dark:text-neutral-400">
                No results found
              </span>
            </div>
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};
