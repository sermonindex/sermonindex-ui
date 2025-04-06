import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import {
  Contributor,
  ListPaginatedResponse,
  ListResponse,
  MediaType,
  SermonInfo,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import DropdownCheckbox from '~/components/dropdown-checkbox';
import { InfiniteScroll } from '~/components/infinite-scroll';
import { SiSection } from '~/components/section';
import { SermonList } from '~/components/sermon-list';
import SiPage from '~/components/si-page';
import { SpeakerBio } from '~/components/speaker-bio';
import { Spinner } from '~/components/spinner';

export async function loader({ params }: LoaderFunctionArgs) {
  const [contributors, sermons] = await Promise.all([
    fetchApi<ListResponse<Contributor>>(
      `/contributors?fullNameSlug=${params.name}`,
    ),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons?fullNameSlug=${params.name}&offset=0&limit=50`,
    ),
  ]);

  if (
    'statusCode' in contributors ||
    'statusCode' in sermons ||
    !contributors.values.length
  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { contributor: contributors.values[0], sermons };
}

export default function Index() {
  const { contributor, sermons: initialSermons } =
    useLoaderData<typeof loader>();
  const [sermons, setSermons] = useState<SermonInfo[]>(initialSermons.values);
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

  const offsetRef = useRef<number | null>(initialSermons.nextPage);
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
        '/sermons',
        {
          fullNameSlug: contributor.fullNameSlug,
          title: title,
          mediaType: mediaTypes.join(','),
          offset: nextOffset,
          limit: 50,
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
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    setLoadingAll(true);
    setSermons([]);

    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(() => fetchSermons(true), 750));
  }, [title, mediaTypes]);

  return (
    <SiPage contributor={contributor}>
      <SiSection title={contributor.fullName}>
        <SpeakerBio contributor={contributor} />
      </SiSection>
      {contributor.images.length > 0 && (
        <SiSection
          title={`Images (${contributor.images.length})`}
          tag="images"
          expandable={true}
          defaultExpanded={false}
        >
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-4">
            {contributor.images.map((image, index) => (
              <div key={`image-${index}`} className="py-4">
                <a href={image.url} target="_blank">
                  <img
                    src={image.url}
                    className="rounded-lg bg-slate-100 w-full"
                    alt={image.title || ''}
                  />
                </a>
              </div>
            ))}
          </div>
        </SiSection>
      )}

      <SiSection title={`Sermons (${initialSermons.total})`} tag="sermon-list">
        <div className="flex items-center space-x-4">
          <input
            className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
            placeholder="Find a sermon..."
            onChange={(e) => setTitle(e.target.value.toLowerCase())}
            required
          />
          <DropdownCheckbox
            title="Filter Media"
            options={Object.values(MediaType)}
            onFilterChange={(options: string[]) =>
              setMediaTypes(options as MediaType[])
            }
          />
        </div>
        {loadingAll && <Spinner />}
        {!loadingAll && (
          <InfiniteScroll
            fetchData={fetchSermons}
            loading={loadingMore}
            error={error}
          >
            <SermonList sermons={sermons} showContributor={false} />
          </InfiniteScroll>
        )}
      </SiSection>
    </SiPage>
  );
}
