import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Contributor, ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SermonList } from '~/components/sermon-list';
import { StandardHeader } from '~/common/section';

export async function loader({ params }: LoaderFunctionArgs) {
  const fullName = params.name?.replace(/-/g, ' ');

  const [contributors, sermons] = await Promise.all([
    fetchApi<ListResponse<Contributor>>(`/contributors?fullName=${fullName}`),
    fetchApi<ListResponse<Sermon>>(`/sermons?fullName=${fullName}`),
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
    <div className="flex flex-col space-y-8 pt-6 px-8 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full p-4 bg-white text-black">
        <StandardHeader text={contributor.fullName} />
        <div className="flex space-x-6 p-4">
          <img
            src={contributor.imageUrl}
            alt={contributor.fullName}
            className="flex-none w-24 h-24 rounded-2xl object-cover"
          />
          <p className="text-left text-sm text-slate-800">
            {contributor.description}
          </p>
        </div>
        <StandardHeader text="Sermons" />
        <input
          className="my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="Find a sermon..."
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
          required
        />
        <div className="">
          <SermonList
            sermons={sermons.values.filter((s) =>
              s.title.toLowerCase().includes(filter),
            )}
          />
        </div>
      </div>
    </div>
  );
}
