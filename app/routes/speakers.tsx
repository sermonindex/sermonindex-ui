import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useMemo, useState } from 'react';
import {
  ContributorInfo,
  ListPaginatedResponse,
  ListResponse,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { formatNumber } from '~/common/format-number';
import { DynamicList } from '~/components/dynamic-list';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const [featured, contributors] = await Promise.all([
    fetchApi<ListResponse<ContributorInfo>>(
      '/contributors/featured/content/SERMONS',
    ),
    fetchApi<ListPaginatedResponse<ContributorInfo>>(
      '/contributors?content=SERMONS&offset=0&limit=100',
    ),
  ]);

  if ('statusCode' in featured || 'statusCode' in contributors) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { featured, contributors };
}

const getContributorGroupedItems = (contributors: ContributorInfo[]) => {
  return contributors.reduce((grouped, contributor) => {
    const letter = contributor.fullName[0].toLowerCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(contributor);
    return grouped;
  }, {} as { [key: string]: ContributorInfo[] });
};

export default function Index() {
  const { featured, contributors } = useLoaderData<typeof loader>();
  const [fullName, setFullName] = useState<string>('');

  const memoizedFilters = useMemo(() => {
    return { fullName, content: 'SERMONS' };
  }, [fullName]);

  return (
    <SiPage>
      <SiSection title="Featured Speakers">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12 py-4">
          {featured.values.map((contributor, index) => (
            <Link to={`/speakers/${contributor.slug}`} key={index}>
              <div key={index} className="flex flex-col items-center m-2 group">
                <div className="relative">
                  <img
                    className="w-16 h-16 rounded-full object-cover group-hover:scale-125 transition-transform duration-200"
                    src={contributor.imageUrl}
                    alt={contributor.fullName}
                  />
                  <span className="flex items-center justify-center bottom-0 left-12 absolute w-7 h-7 text-[10px] rounded-full text-black dark:text-white bg-neutral-300 dark:bg-neutral-600 border-2 border-si-light dark:border-si-slate">
                    {formatNumber(contributor.sermonCount)}
                  </span>
                </div>
                <p className="text-center mt-2 text-sm">
                  {contributor.fullName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SiSection>
      <SiSection title="All Speakers" count={contributors.total}>
        <input
          className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-black"
          placeholder="Find a speaker..."
          onChange={(e) => setFullName(e.target.value.toLowerCase())}
          required
        />

        <DynamicList<ContributorInfo>
          items={contributors.values}
          baseUrl="/contributors"
          filters={memoizedFilters}
          nextPage={contributors.nextPage}
          limit={100}
          renderItems={(items) => (
            <GenericList<ContributorInfo>
              items={items}
              getGroupedItems={getContributorGroupedItems}
              getGroupKeyName={(key: string) => key}
              getItemId={(contributor: ContributorInfo) => contributor.slug}
              getItemName={(contributor: ContributorInfo) =>
                contributor.fullName
              }
              getItemLink={(contributor: ContributorInfo) =>
                `/speakers/${contributor.slug}`
              }
              getItemCount={(contributor: ContributorInfo) =>
                contributor.sermonCount
              }
            />
          )}
        />
      </SiSection>
    </SiPage>
  );
}
