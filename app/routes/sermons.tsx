import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ListPaginatedResponse, SermonInfo } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SermonList } from '~/components/sermon-list';
import { SiPage } from '~/components/si-page';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

enum SermonTabs {
  TopSermons = 'Top Sermons',
  Featured = 'Previously Featured',
  RecentViews = 'Recently Viewed',
  RecentUploads = 'Recently Uploaded',
}

export async function loader({ params }: LoaderFunctionArgs) {
  const [topSermons, recentViews, recentUploads, featured] = await Promise.all([
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons?sortBy=views&sortOrder=desc&offset=0&limit=25`,
    ),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons/viewed?offset=0&limit=25`,
    ),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons/uploaded?offset=0&limit=25`,
    ),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons/featured?offset=1&limit=25`,
    ),
  ]);

  if (
    'statusCode' in topSermons ||
    'statusCode' in recentViews ||
    'statusCode' in recentUploads ||
    'statusCode' in featured
  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { topSermons, recentViews, recentUploads, featured };
}

export default function Index() {
  const { topSermons, recentViews, recentUploads, featured } =
    useLoaderData<typeof loader>();

  const [activeTab, setActiveTab] = useState(SermonTabs.TopSermons);

  return (
    <SiPage>
      <div className="p-3 md:p-8">
        <div className="flex items-center space-x-4 md:space-x-12">
          <img
            className="w-28 h-28 md:w-44 md:h-44 rounded-full object-cover flex-shrink-0"
            src={'https://sermonindex3.b-cdn.net/pdf/dlmoody.png'}
            alt={'D.L. Moody'}
            loading="lazy"
          />
          <div className="flex flex-col mb-2">
            <h3 className="md:text-2xl font-bold">The preaching </h3>
            <h3 className="md:text-xl italic">that this world needs most</h3>
            <h3 className="md:text-xl">
              is{' '}
              <span className="md:text-2xl font-bold"> sermons in shoes</span>
            </h3>
            <h3 className="md:text-xl">
              that are{' '}
              <span className="md:text-2xl font-bold">
                walking with Jesus Christ.
              </span>
            </h3>
            <h3 className="pl-3 pt-1"> - D.L. Moody</h3>
          </div>
        </div>
      </div>
      <TabContainer>
        <TabList>
          {Object.values(SermonTabs).map((tab, index) => (
            <TabListItem
              title={tab}
              key={index}
              active={tab === activeTab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </TabList>

        <TabContent
          key={SermonTabs.TopSermons}
          active={activeTab === SermonTabs.TopSermons}
          className="px-1 md:px-4 py-2"
        >
          <SermonList
            sermons={topSermons.values}
            filters={{ sortBy: 'views', sortOrder: 'desc' }}
            nextPage={topSermons.nextPage}
            showContributor={true}
          />
        </TabContent>

        <TabContent
          key={SermonTabs.Featured}
          active={activeTab === SermonTabs.Featured}
          className="py-4 px-2 md:p-6"
        >
          <SermonList
            sermons={featured.values}
            baseUrl="/sermons/featured"
            nextPage={featured.nextPage}
            showContributor={true}
            showSearch={false}
          />
        </TabContent>

        <TabContent
          key={SermonTabs.RecentViews}
          active={activeTab === SermonTabs.RecentViews}
          className="py-4 px-2 md:p-6"
        >
          <SermonList
            sermons={recentViews.values}
            baseUrl="/sermons/viewed"
            nextPage={recentViews.nextPage}
            showContributor={true}
            showSearch={false}
          />
        </TabContent>

        <TabContent
          key={SermonTabs.RecentUploads}
          active={activeTab === SermonTabs.RecentUploads}
          className="py-4 px-2 md:p-6"
        >
          <SermonList
            sermons={recentUploads.values}
            baseUrl="/sermons/uploaded"
            nextPage={recentUploads.nextPage}
            showContributor={true}
            showSearch={false}
          />
        </TabContent>
      </TabContainer>
    </SiPage>
  );
}
