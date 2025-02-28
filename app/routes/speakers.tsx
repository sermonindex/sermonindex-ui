import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Contributor, ListResponse } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SiSection } from '~/components/section';
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
      <SiSection title="Featured Speakers">
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
                  className="w-16 h-16 rounded-full object-cover group-hover:scale-110 transition-transform duration-200"
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
      </SiSection>
      <SiSection title="All Speakers">
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
      </SiSection>
    </SiPage>
  );
}
