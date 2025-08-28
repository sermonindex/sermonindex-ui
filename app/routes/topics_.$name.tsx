import { LoaderFunctionArgs } from '@remix-run/node';
import { json, MetaFunction, useLoaderData } from '@remix-run/react';
import { ListPaginatedResponse, SermonInfo, Topic } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SiSection } from '~/components/section';
import { SermonList } from '~/components/sermon-list';
import { SiPage } from '~/components/si-page';

import React from 'react';
import { getMetaTags } from '~/common/get-meta-tags';
import { linkifyScripture } from '~/components/linkify-scripture';

export async function loader({ params }: LoaderFunctionArgs) {
  const [topic, sermons] = await Promise.all([
    fetchApi<Topic>(`/topics/slug/${params.name}`),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons?topicSlug=${params.name}&offset=0&limit=25`,
    ),
  ]);

  if ('statusCode' in topic || 'statusCode' in sermons) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return json(
    { topic, sermons },
    { headers: { 'Cache-Control': 'public, max-age=86400' } },
  );
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title = `Sermons on ${data?.topic.name}`;
  const description = `Explore sermons and teachings on the topic of ${data?.topic.name}.`;
  const url = `https://sermonindex.net/topics/${params.name}`;

  return getMetaTags({
    title,
    description,
    url,
  });
};

export default function Index() {
  const { topic, sermons } = useLoaderData<typeof loader>();

  return (
    <SiPage>
      <SiSection title={topic.name} tag="topic">
        <p className="whitespace-pre-line">
          {linkifyScripture(topic.summary).map((part, index) => (
            <React.Fragment key={index}>{part}</React.Fragment>
          ))}
        </p>
      </SiSection>
      <SiSection title={topic.name} count={sermons.total} tag="sermon-list">
        <SermonList
          sermons={sermons.values}
          filters={{ topicSlug: topic.slug }}
          nextPage={sermons.nextPage}
          showContributor={true}
        />
      </SiSection>
    </SiPage>
  );
}
