import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { formatDownloads } from '~/common/format-downloads';
import { FeaturedMessage } from '~/components/featured';
import SermonCarousel from '~/components/sermon-carosel';

export const meta: MetaFunction = () => {
  return [
    { title: 'SermonIndex' },
    { name: 'description...', content: 'This is a PoC...' },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const [popular, recent, featured] = await Promise.all([
    fetchApi<ListResponse<Sermon>>('/sermons/popular'),
    fetchApi<ListResponse<Sermon>>('/sermons/recent'),
    fetchApi<Sermon>('/sermons/featured'),
  ]);

  if (
    'statusCode' in popular ||
    'statusCode' in recent ||
    'statusCode' in featured
  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { popular, recent, featured };
}

export default function Index() {
  const { popular, recent, featured } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col space-y-8 pt-6 px-8 min-h-[calc(100vh-80px)]">
      <div className="flex w-full bg-white">
        <FeaturedMessage sermon={featured} />
      </div>

      <SermonCarousel
        title={'Recent Uploads'}
        sermons={recent.values}
        customizer={(sermon) => {
          // TODO: Use a better date library (moment or dayjs)
          const date = new Date(sermon.createdAt as string);
          const prettyDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return <span className="font-thin">{`${prettyDate} `}</span>;
        }}
      />

      <SermonCarousel
        title={'Popular Sermons'}
        sermons={popular.values}
        customizer={(sermon) => (
          <span className="font-thin">{`${formatDownloads(
            sermon.hits,
          )} Downloads`}</span>
        )}
      />
    </div>
  );
}
