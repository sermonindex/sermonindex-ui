import { LoaderFunctionArgs } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';
import { Topic } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SiSection } from '~/components/section';
import { SermonList } from '~/components/sermon-list';
import { SiPage } from '~/components/si-page';

import React from 'react';
import { linkifyScripture } from '~/components/linkify-scripture';

export async function loader({ params }: LoaderFunctionArgs) {
  const [topic] = await Promise.all([
    fetchApi<Topic>(`/topics/slug/${params.name}`),
  ]);

  if ('statusCode' in topic) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { topic };
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title = `${data?.topic.name} | Sermons & Teachings | SermonIndex`;
  const description = `Explore sermons and teachings on the topic of ${data?.topic.name} on SermonIndex.`;

  return [
    { title },
    {
      name: 'description',
      content: description,
    },
    { property: 'og:title', content: title },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: 'https://sermonindex3.b-cdn.net/si-images/og-image.png',
    },
    {
      property: 'og:url',
      content: `https://sermonindex.net/topics/${params.name}`,
    },
  ];
};

export default function Index() {
  const { topic } = useLoaderData<typeof loader>();

  return (
    <SiPage>
      <SiSection title={topic.name} tag="topic">
        <p className="whitespace-pre-line">
          {linkifyScripture(topic.summary).map((part, index) => (
            <React.Fragment key={index}>{part}</React.Fragment>
          ))}
        </p>
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
