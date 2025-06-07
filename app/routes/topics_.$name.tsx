import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { SermonTopic } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SiSection } from '~/components/section';
import { SermonList } from '~/components/sermon-list';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const [topic] = await Promise.all([
    fetchApi<SermonTopic>(`/topics/slug/${params.name}`),
  ]);

  if ('statusCode' in topic) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { topic };
}

export default function Index() {
  const { topic } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  return (
    <SiPage>
      <SiSection title={topic.name} tag="topic">
        <p>{topic.summary}</p>
      </SiSection>
      <SiSection
        title={topic.name}
        count={topic.sermons.length}
        tag="sermon-list"
      >
        <SermonList
          sermons={topic.sermons}
          filters={{ topic: topic.name }}
          showContributor={true}
        />
      </SiSection>
    </SiPage>
  );
}
