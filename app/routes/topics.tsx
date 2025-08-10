import { LoaderFunctionArgs } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { ListPaginatedResponse, TopicInfo } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { getMetaTags } from '~/common/get-meta-tags';
import { DynamicList } from '~/components/dynamic-list';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';
import { TopicBubbles } from '~/components/topic-bubbles';

export async function loader({ params }: LoaderFunctionArgs) {
  const [topics, popular] = await Promise.all([
    fetchApi<ListPaginatedResponse<TopicInfo>>('/topics?offset=0&limit=100'),
    fetchApi<ListPaginatedResponse<TopicInfo>>(
      '/topics?sortBy=sermons&sortOrder=desc&offset=0&limit=30',
    ),
  ]);

  if ('statusCode' in topics || 'statusCode' in popular) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { topics, popular };
}

export const meta: MetaFunction<typeof loader> = () => {
  const title = 'Biblical Topics';
  const description =
    'Explore a variety of biblical topics and teachings on SermonIndex.';
  const url = 'https://sermonindex.net/topics';

  return getMetaTags({
    title,
    description,
    url,
  });
};

const getTopicGroupedItems = (topics: TopicInfo[]) => {
  return topics.reduce((grouped, topic) => {
    const letter = topic.name[0].toLowerCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(topic);
    return grouped;
  }, {} as { [key: string]: TopicInfo[] });
};

export default function Index() {
  const { topics, popular } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  const memoizedFilters = useMemo(() => ({ name: filter }), [filter]);

  return (
    <SiPage>
      <SiSection title="Popular Topics">
        <TopicBubbles topics={popular.values} />
      </SiSection>
      <SiSection title="All Topics" count={topics.total}>
        <input
          className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
          placeholder="Find a topic..."
          type="search"
          name="search topics"
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
          required
        />
        <DynamicList<TopicInfo>
          items={topics.values}
          baseUrl="/topics"
          filters={memoizedFilters}
          nextPage={topics.nextPage}
          limit={100}
          renderItems={(items) => (
            <GenericList<TopicInfo>
              items={items}
              getGroupedItems={getTopicGroupedItems}
              getGroupKeyName={(key: string) => key}
              getItemId={(topic: TopicInfo) => topic.slug}
              getItemName={(topic: TopicInfo) => topic.name}
              getItemLink={(topic: TopicInfo) => `/topics/${topic.slug}`}
              getItemCount={(topic: TopicInfo) => topic.sermonCount}
            />
          )}
        />
      </SiSection>
    </SiPage>
  );
}
