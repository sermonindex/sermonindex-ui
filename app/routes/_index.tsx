import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ListResponse, SermonInfo } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { formatNumber } from '~/common/format-number';
import SermonCarousel from '~/components/sermon-carosel';
import { SiPage } from '~/components/si-page';
import { Teaser } from '~/components/teaser';

export const meta: MetaFunction = () => {
  return [
    { title: 'SermonIndex' },
    { name: 'description...', content: 'This is a PoC...' },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const [popular, recent, featured] = await Promise.all([
    fetchApi<ListResponse<SermonInfo>>('/sermons?sortBy=views&sortOrder=desc'),
    fetchApi<ListResponse<SermonInfo>>(
      '/sermons?sortBy=createdAt&sortOrder=desc',
    ),
    fetchApi<ListResponse<SermonInfo>>('/sermons/featured'),
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

  const mainFeatured = featured.values[0];

  return (
    <SiPage>
      <div className="flex flex-wrap justify-center gap-8 px-1 py-4 md:px-8">
        <Teaser
          type={'Featured Sermon'}
          title={mainFeatured.title}
          link={`/sermons/${mainFeatured.id}`}
          imageUrl={mainFeatured.thumbnailUrl}
          author={mainFeatured.contributorFullName}
          mediaType={mainFeatured.mediaType.toString().toLowerCase()}
          views={mainFeatured.views}
        />

        <Teaser
          type={'Featured Article'}
          title={'How to Cultivate Humility'}
          link={`/blog/2025-06-07%20How%20to%20cultivate%20humility`}
          imageUrl={
            'https://www.orthodoxphotos.com/Orthodox_Elders/Greek/Fr._Paisios/2.jpg'
          }
          author={'Elder Paisios'}
          mediaType={'blog'}
        />

        <Teaser
          type={'Featured Book'}
          title={'Abandonment To Divine Providence'}
          link={'/books/68b5a420-e7df-4412-8048-e37ae5c76c68/contents'}
          text={
            'The Rev. Jean Pierre de Caussade was one of the most remarkable spiritual writers of the Society of Jesus in France in the 18th Century. His death took place at Toulouse in 1751. His works have gone through many editions and have been republished, and translated into several foreign languages.'
          }
          author={'Jean-Pierre de Caussade'}
          mediaType={'book'}
        />
      </div>

      <SermonCarousel
        title={'Recent Uploads'}
        sermons={recent.values}
        customizer={(sermon) => {
          // TODO: Use a better date library (moment or dayjs)
          const date = new Date(sermon.createdAt as any as string);
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
          <span className="font-thin">{`${formatNumber(
            sermon.views,
          )} Downloads`}</span>
        )}
      />
    </SiPage>
  );
}
