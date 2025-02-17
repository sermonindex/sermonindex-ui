import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Contributor, ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { StandardHeader } from '~/common/section';
import { SermonList } from '~/components/sermon-list';
import SiPage from '~/components/si-page';
import { SpeakerBio } from '~/components/speaker-bio';

export async function loader({ params }: LoaderFunctionArgs) {
  const [contributors, sermons] = await Promise.all([
    fetchApi<ListResponse<Contributor>>(
      `/contributors?fullNameSlug=${params.name}`,
    ),
    fetchApi<ListResponse<Sermon>>(`/sermons?fullNameSlug=${params.name}`),
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
  const { contributor, sermons } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  return (
    <SiPage contributor={contributor}>
      <div className="flex flex-col space-y-8 pt-6 px-8 min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full p-4">
          <SpeakerBio contributor={contributor} showImageLink={true} />
          <div id="sermon-list">
            <StandardHeader text={`Sermons (${sermons.values.length})`} />
            <input
              className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
              placeholder="Find a sermon..."
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
              required
            />

            <SermonList
              sermons={sermons.values.filter((s) =>
                s.title.toLowerCase().includes(filter),
              )}
              showTopic={true}
              showContributor={false}
            />
          </div>
        </div>
      </div>
    </SiPage>
  );
}
