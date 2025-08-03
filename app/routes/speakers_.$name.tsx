import { LoaderFunctionArgs } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import {
  BookInfo,
  Contributor,
  ListPaginatedResponse,
  SermonInfo,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { BookList } from '~/components/book-list';
import { ContributorCard } from '~/components/contributor-card';
import { SermonList } from '~/components/sermon-list';
import { SiPage } from '~/components/si-page';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

enum SpeakerTabs {
  Sermons = 'Sermons',
  Books = 'Books',
  Bio = 'Bio',
  Images = 'Images',
}

export async function loader({ params }: LoaderFunctionArgs) {
  const [contributor, sermons, books] = await Promise.all([
    fetchApi<Contributor>(`/contributors/slug/${params.name}`),
    fetchApi<ListPaginatedResponse<SermonInfo>>(
      `/sermons?contributorSlug=${params.name}&offset=0&limit=25`,
    ),
    fetchApi<ListPaginatedResponse<BookInfo>>(
      `/books?contributorSlug=${params.name}`,
    ),
  ]);

  if (
    'statusCode' in contributor ||
    'statusCode' in sermons ||
    'statusCode' in books
  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { contributor, sermons, books };
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title = `${data?.contributor.fullName} | Sermons & Teachings | SermonIndex`;
  const description = `Explore sermons and teachings by ${data?.contributor.fullName} on SermonIndex.`;

  return [
    { title },
    {
      name: 'description',
      content: description,
    },
    { property: 'og:title', content: title },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: 'https://sermonindex3.b-cdn.net/si-images/og-image.png',
    },
    {
      property: 'og:url',
      content: `https://sermonindex.net/speakers/${params.name}`,
    },
  ];
};

export default function Index() {
  const { contributor, sermons, books } = useLoaderData<typeof loader>();

  let availableTabs = Object.values(SpeakerTabs);
  if (contributor.images.length === 0) {
    availableTabs = availableTabs.filter((tab) => tab !== SpeakerTabs.Images);
  }
  if (contributor.bookCount === 0) {
    availableTabs = availableTabs.filter((tab) => tab !== SpeakerTabs.Books);
  }
  if (contributor.sermonCount === 0) {
    availableTabs = availableTabs.filter((tab) => tab !== SpeakerTabs.Sermons);
  }

  const [activeTab, setActiveTab] = useState(
    availableTabs.includes(SpeakerTabs.Sermons)
      ? SpeakerTabs.Sermons
      : availableTabs[0],
  );

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

        {contributor.sermonCount > 0 && (
          <TabContent
            key={SpeakerTabs.Sermons}
            active={activeTab === SpeakerTabs.Sermons}
            className="px-1 md:px-4 py-2"
          >
            <SermonList
              sermons={sermons.values}
              filters={{ contributorSlug: contributor.slug }}
              nextPage={sermons.nextPage}
              showContributor={false}
            />
          </TabContent>
        )}

        {contributor.bookCount > 0 && (
          <TabContent
            key={SpeakerTabs.Books}
            active={activeTab === SpeakerTabs.Books}
            className="px-1 md:px-4 py-2"
          >
            <BookList
              books={books.values}
              filters={{ contributorSlug: contributor.slug }}
              nextPage={books.nextPage}
            />
          </TabContent>
        )}

        <TabContent
          key={SpeakerTabs.Bio}
          active={activeTab === SpeakerTabs.Bio}
          className="py-4 px-2 md:p-6"
        >
          <p className="text-sm md:text-base">
            {contributor.bio ??
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
                      loading="lazy"
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
