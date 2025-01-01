import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { formatDownloads } from '~/common/format-downloads';
import { StandardHeader } from '~/common/section';
import SiPage from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const [popular] = await Promise.all([
    fetchApi<ListResponse<Sermon>>('/sermons/popular'),
  ]);

  if ('statusCode' in popular) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { popular };
}

export default function Index() {
  const { popular } = useLoaderData<typeof loader>();

  return (
    <SiPage>
      <div className="flex flex-col space-y-8 md:pt-6 md:px-8 min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full p-4">
          <StandardHeader text="Top 100" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 md:gap-4 pt-4">
            {popular.values.map((sermon, index) => (
              <Link to={`/sermons/${sermon.id}`} key={index}>
                <div
                  key={index}
                  className="
                    flex flex-col
                    relative
                    min-h-44
                    m-2 p-4
                    rounded-lg
                    border-2
                    bg-si-blend
                    hover:bg-gray-300
                    hover:border-si-accent
                    hover:cursor-pointer
                    hover:underline
                    dark:bg-si-rock
                    dark:border-si-dark
                    dark:hover:bg-gray-700
                    dark:hover:border-si-accent
                    group
                  "
                >
                  <span className="absolute top-0 left-0 w-14 h-full flex items-center justify-center text-2xl font-bold bg-si-gray dark:bg-si-dark rounded-l-lg">
                    {index + 1}
                  </span>
                  <img
                    src={
                      sermon.contributorImageUrl
                        ? sermon.contributorImageUrl
                        : 'https://sermonindex1.b-cdn.net/default-si-speaker.png'
                    }
                    alt={sermon.title}
                    className="w-15 h-20 rounded-2xl object-cover absolute top-4 left-20"
                  />
                  <div className="pl-36 items-center text-md">
                    {sermon.title.length > 50
                      ? sermon.title.substring(0, 47) + '...'
                      : sermon.title}
                  </div>
                  <p className="absolute bottom-4 left-20 text-sm">
                    {sermon.contributorFullName}
                  </p>
                  <p className="absolute bottom-4 right-4 text-sm">
                    {formatDownloads(sermon.hits)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiPage>
  );
}
