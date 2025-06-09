import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ListResponse, TopicInfo } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';
import { TopicBubbles } from '~/components/topic-bubbles';

export async function loader({ params }: LoaderFunctionArgs) {
  const [topics, popular] = await Promise.all([
    fetchApi<ListResponse<TopicInfo>>('/topics'),
    fetchApi<ListResponse<TopicInfo>>('/topics?sortBy=sermons&sortOrder=desc&limit=30'),
  ]);

  if ('statusCode' in topics || 'statusCode' in popular) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { topics, popular };
}

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

  return (
    <SiPage>
      <SiSection title="Popular Topics">
        <TopicBubbles
          topics={popular.values.filter((t) =>
            t.name.toLowerCase().includes(filter),
          )}
        />
      </SiSection>
      <SiSection title="All Topics" count={topics.values.length}>
        <input
          className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
          placeholder="Find a topic..."
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
          required
        />
        <GenericList<TopicInfo>
          items={topics.values.filter((t) =>
            t.name.toLowerCase().includes(filter),
          )}
          getGroupedItems={getTopicGroupedItems}
          getGroupKeyName={(key: string) => key}
          getItemId={(topic: TopicInfo) => topic.slug}
          getItemName={(topic: TopicInfo) => topic.name}
          getItemLink={(topic: TopicInfo) => `/topics/${topic.slug}`}
          getItemCount={(topic: TopicInfo) => topic.sermonCount}
        />
      </SiSection>
    </SiPage>
  );
}
