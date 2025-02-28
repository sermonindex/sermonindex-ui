import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ListResponse, Topic } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SiSection } from '~/components/section';
import SiPage from '~/components/si-page';
import { useState } from 'react';
import { TopicList } from '~/components/topic-list';
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
      <SiSection title="All Topics">
        <input
          className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
          placeholder="Find a topic..."
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
          required
        />
        <TopicList
          topics={topics.values.filter((t) =>
            t.name.toLowerCase().includes(filter),
          )}
        />
      </SiSection>
    </SiPage>
  );
}
