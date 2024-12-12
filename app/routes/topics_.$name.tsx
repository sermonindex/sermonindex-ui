import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { SermonTopic } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { StandardHeader } from '~/common/section';
import { SermonList } from '~/components/sermon-list';
import SiPage from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const [topic] = await Promise.all([
    fetchApi<SermonTopic>(`/topics/topicName/${params.name}`),
  ]);

  if ('statusCode' in topic) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { topic };
}

function formatTopicTitle(name: string, count: number): string {
  return `${count} Sermon${count === 1 ? '' : 's'} on ${name}`;
}

export default function Index() {
  const { topic } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  return (
    <SiPage>
      <div className="flex flex-col space-y-8 pt-6 px-8 min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full p-4">
          <div id="sermon-list">
            <StandardHeader
              text={formatTopicTitle(topic.name, topic.sermons.length)}
            />
            <input
              className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
              placeholder={`Search sermons with topic "${topic.name}"...`}
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
              required
            />

            <SermonList
              sermons={topic.sermons.filter((s) =>
                s.title.toLowerCase().includes(filter),
              )}
              showTopic={false}
              showContributor={true}
            />
          </div>
        </div>
      </div>
    </SiPage>
  );
}
