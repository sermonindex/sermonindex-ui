import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Contributor, ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SiSection } from '~/components/section';
import { SermonList } from '~/components/sermon-list';
import SiPage from '~/components/si-page';
import { SpeakerBio } from '~/components/speaker-bio';
import DropdownCheckbox from '~/components/dropdown-checkbox';

export async function loader({ params }: LoaderFunctionArgs) {
  const [contributors, sermons] = await Promise.all([
    fetchApi<ListResponse<Contributor>>(
      `/contributors?fullNameSlug=${params.name}`,
    ),
    fetchApi<ListResponse<Sermon>>(`/sermons?fullNameSlug=${params.name}`),
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
  const { contributor, sermons: initialSermons } =
    useLoaderData<typeof loader>();
  const [sermons, setSermons] = useState<Sermon[]>(initialSermons.values);
  const [filter, setFilter] = useState<string>('');

  return (
    <SiPage contributor={contributor}>
      <SiSection title={contributor.fullName}>
        <SpeakerBio contributor={contributor} />
      </SiSection>
      {contributor.images.length > 0 && (
        <SiSection
          title={`Images (${contributor.images.length})`}
          expandable={true}
          defaultExpanded={false}
        >
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-4">
            {contributor.images.map((image, index) => (
              <div key={`image-${index}`} className="py-4">
                <a href={image.url} target="_blank">
                  <img
                    src={image.url}
                    className="rounded-lg bg-slate-100 w-full"
                    alt={image.title || ''}
                  />
                </a>
              </div>
            ))}
          </div>
        </SiSection>
      )}

      <SiSection title={`Sermons (${sermons.values.length})`} tag="sermon-list">
        <div className="flex items-center space-x-4">
          <input
            className="my-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
            placeholder="Find a sermon..."
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            required
          />
          <DropdownCheckbox
            title="Filter Media"
            options={['Video', 'Audio', 'Text']}
            onFilterChange={(options: string[]) => {
              if (options.length === 0) {
                setSermons([]);
                return;
              }

              const mediaTypes = options
                .map((option) => option.toUpperCase())
                .join(',');

              fetchApi<ListResponse<Sermon>>(
                `/sermons?fullNameSlug=${contributor.fullNameSlug}&mediaType=${mediaTypes}`,
              ).then((fetchedSermons) => {
                if ('statusCode' in fetchedSermons) {
                  console.error(
                    'Failed to search for sermons:',
                    fetchedSermons,
                  );
                  setSermons([]);
                  return;
                }
                if (fetchedSermons.values.length === 0) {
                  setSermons([]);
                  return;
                }
                setSermons(fetchedSermons.values);
              });
            }}
          />
        </div>
        <SermonList
          sermons={sermons.filter((s) =>
            s.title.toLowerCase().includes(filter),
          )}
          showTopic={true}
          showContributor={false}
        />
      </SiSection>
    </SiPage>
  );
}
