import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ListResponse, Topic } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';
import { TopicBubbles } from '~/components/topic-bubbles';

export async function loader({ params }: LoaderFunctionArgs) {
  const [topics, popular] = await Promise.all([
    fetchApi<ListResponse<Topic>>('/topics'),
    fetchApi<ListResponse<Topic>>('/topics/popular'),
  ]);

  if ('statusCode' in topics || 'statusCode' in popular) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { topics, popular };
}

const getTopicGroupedItems = (topics: Topic[]) => {
  return topics.reduce((grouped, topic) => {
    const letter = topic.name[0].toLowerCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(topic);
    return grouped;
  }, {} as { [key: string]: Topic[] });
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
        <GenericList<Topic>
          items={topics.values.filter((t) =>
            t.name.toLowerCase().includes(filter),
          )}
          getGroupedItems={getTopicGroupedItems}
          getGroupKeyName={(key: string) => key}
          getItemId={(topic: Topic) => topic.slug}
          getItemName={(topic: Topic) => topic.name}
          getItemLink={(topic: Topic) => `/topics/${topic.slug}`}
          getItemCount={(topic: Topic) => topic.sermonCount}
        />
      </SiSection>
    </SiPage>
  );
}
