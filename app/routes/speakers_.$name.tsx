import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import {
  Contributor,
  ListPaginatedResponse,
  ListResponse,
  SermonInfo,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { ContributorCard } from '~/components/contributor-card';
import { SermonList } from '~/components/sermon-list';
import SiPage from '~/components/si-page';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

enum SpeakerTabs {
  Sermons = 'Sermons',
  Bio = 'Bio',
  Images = 'Images',
}

export async function loader({ params }: LoaderFunctionArgs) {
  const [contributors, sermons] = await Promise.all([
    fetchApi<ListResponse<Contributor>>(
      `/contributors?fullNameSlug=${params.name}`,
    ),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons?fullNameSlug=${params.name}&offset=0&limit=50`,
    ),
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

  const [activeTab, setActiveTab] = useState(SpeakerTabs.Sermons);

  let availableTabs = Object.values(SpeakerTabs);
  if (contributor.images.length === 0) {
    availableTabs = availableTabs.filter((tab) => tab !== SpeakerTabs.Images);
  }

  return (
    <SiPage>
      <div className="p-3 md:p-10">
        <ContributorCard contributor={contributor} />
      </div>
      <TabContainer>
        <TabList>
          {availableTabs.map((tab, index) => (
            <TabListItem
              title={tab}
              key={index}
              active={tab === activeTab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </TabList>

        <TabContent
          key={SpeakerTabs.Sermons}
          active={activeTab === SpeakerTabs.Sermons}
          className="px-1 md:px-4 py-2"
        >
          <SermonList
            sermons={initialSermons.values}
            filters={{ fullNameSlug: contributor.fullNameSlug }}
            nextPage={initialSermons.nextPage}
            showContributor={false}
          />
        </TabContent>

        <TabContent
          key={SpeakerTabs.Bio}
          active={activeTab === SpeakerTabs.Bio}
          className="py-4 px-2 md:p-6"
        >
          <p className="text-sm md:text-base">
            {contributor.description ??
              'No biography available for this speaker. Check back soon!'}
          </p>
        </TabContent>

        {contributor.images.length > 0 && (
          <TabContent
            key={SpeakerTabs.Images}
            active={activeTab === SpeakerTabs.Images}
            className="p-2 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-4">
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
          </TabContent>
        )}
      </TabContainer>
    </SiPage>
  );
}
