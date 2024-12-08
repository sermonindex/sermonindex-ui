import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Contributor, ListResponse } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { StandardHeader } from '~/common/section';
import SiPage from '~/components/si-page';
import { SpeakerList } from '~/components/speaker-list';

export async function loader({ params }: LoaderFunctionArgs) {
  const [featured, contributors] = await Promise.all([
    fetchApi<ListResponse<Contributor>>('/contributors/featured'),
    fetchApi<ListResponse<Contributor>>('/contributors'),
  ]);

  if ('statusCode' in featured || 'statusCode' in contributors) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { featured, contributors };
}

export default function Index() {
  const { featured, contributors } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  return (
    <SiPage>
      <div className="flex flex-col space-y-8 md:pt-3 md:px-8 min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full p-4">
          <StandardHeader text="Featured Speakers" />
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12 py-4">
            {featured.values.map((contributor, index) => (
              <Link to={`/speakers/${contributor.fullNameSlug}`} key={index}>
                <div
                  key={index}
                  className="flex flex-col items-center m-2 hover:underline group"
                >
                  <img
                    src={
                      contributor.imageUrl
                        ? contributor.imageUrl
                        : 'https://sermonindex1.b-cdn.net/default-si-speaker.png'
                    }
                    alt={contributor.fullName}
                    className="w-14 h-14 rounded-full object-cover group-hover:scale-110 transition-transform duration-200"
                  />
                  <p className="text-center mt-2 text-sm">
                    {contributor.fullName}
                  </p>
                  <p className="text-center text-sm">
                    ({contributor.sermonCount})
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <StandardHeader text="All Speakers" />
          <div className="">
            <input
              className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
              placeholder="Find a speaker..."
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
              required
            />
            <SpeakerList
              contributors={contributors.values.filter((c) =>
                c.fullName.toLowerCase().includes(filter),
              )}
            />
          </div>
        </div>
      </div>
    </SiPage>
  );
}
