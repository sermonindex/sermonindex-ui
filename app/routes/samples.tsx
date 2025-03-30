import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { formatNumber } from '~/common/format-number';
import { FeaturedMessage } from '~/components/featured';
import SiPage from '~/components/si-page';
import { Player } from '~/components/media/player';
import { SiSection } from '~/components/section';

export async function loader({ params }: LoaderFunctionArgs) {
  const [popular, recent, featured, videoSermon] = await Promise.all([
    fetchApi<ListResponse<Sermon>>('/sermons/popular'),
    fetchApi<ListResponse<Sermon>>('/sermons/recent'),
    fetchApi<Sermon>('/sermons/featured'),
    fetchApi<Sermon>('/sermons/id/4881'),
  ]);

  if (
    'statusCode' in popular ||
    'statusCode' in recent ||
    'statusCode' in featured ||
    'statusCode' in videoSermon
  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { popular, recent, featured, videoSermon };
}

export default function Index() {
  const { popular, recent, featured, videoSermon } =
    useLoaderData<typeof loader>();

  return (
    <SiPage>
      <span className="p-4">Example New Audio</span>
      <SiSection>
        <Player sermons={[featured]} />
      </SiSection>

      <span className="p-4">Example New Video</span>
      <SiSection>
        <Player sermons={[videoSermon]} />
      </SiSection>
    </SiPage>
  );
}
