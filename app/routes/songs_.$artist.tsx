import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Contributor, Hymn, ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { ContributorCard } from '~/components/contributor-card';
import { Player } from '~/components/media/player';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';
import { SpeakerBio } from '~/components/speaker-bio';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

export async function loader({ params }: LoaderFunctionArgs) {
  const [songs, artist] = await Promise.all([
    fetchApi<ListResponse<Hymn>>(`/hymns?contributorSlug=${params.artist}`),
    fetchApi<Contributor>(`/contributors/slug/${params.artist}`),
  ]);

  if ('statusCode' in songs || 'statusCode' in artist) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { songs, artist: artist };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: 'Not Found | SermonIndex' },
      { name: 'description', content: 'The requested content was not found.' },
    ];
  }

  const { songs, artist } = data;
  return [
    { title: `Songs by ${artist.fullName} | SermonIndex` },
    {
      name: 'description',
      content: `A collection of songs by ${artist.fullName} on SermonIndex`,
    },
  ];
};

enum SongTabs {
  Songs = 'Songs',
  Bio = 'Bio',
  Images = 'Images',
}

export default function Index() {
  const { songs, artist } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState(SongTabs.Songs);

  let availableTabs = Object.values(SongTabs);
  if (artist.images.length === 0) {
    availableTabs = availableTabs.filter((tab) => tab !== SongTabs.Images);
  }

  // convert the songs to sermon type for the media player
  // we could make a custom prop for the media player or make it
  // generic, but this is a quick solution for today
  const sermons: Sermon[] = songs.values.map((song) => ({
    id: song.id,
    contributorSlug: song.contributorSlug!,
    contributorFullName: song.contributorFullName!,
    contributorImageUrl: song.contributorImageUrl,
    title: song.title,
    mediaType: song.mediaType,
    duration: song.duration,
    views: song.views,
    streamUrl: song.streamUrl,
    downloadUrl: song.downloadUrl,
    bibleReferences: [],
    topics: [],
    createdAt: '',
  }));

  return (
    <SiPage>
      {/* Desktop-only Bio Header, hidden on mobile */}
      <div className="hidden lg:block">
        <SiSection title={artist.fullName} sharesRightPadding={true}>
          <SpeakerBio contributor={artist} seeAllLinkVisible={true} />
        </SiSection>
        <SiSection title={'Songs'}>
          <Player sermons={sermons} />
        </SiSection>
      </div>

      {/* Mobile-only Contributor Card Header, hidden on desktop */}
      <div className="block lg:hidden">
        <div className="p-3 md:p-10">
          <ContributorCard contributor={artist} />
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
            key={SongTabs.Songs}
            active={activeTab === SongTabs.Songs}
            className="md:px-1 lg:px-4 md:py-2"
          >
            <Player sermons={sermons} type={'hymns'} />
          </TabContent>

          <TabContent
            key={SongTabs.Bio}
            active={activeTab === SongTabs.Bio}
            className="py-4 px-2 md:p-6"
          >
            <p className="text-sm md:text-base">
              {artist.bio ??
                'No biography available for this speaker. Check back soon!'}
            </p>
          </TabContent>

          {artist.images.length > 0 && (
            <TabContent
              key={SongTabs.Images}
              active={activeTab === SongTabs.Images}
              className="p-2 md:p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-4">
                {artist.images.map((image, index) => (
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
      </div>
    </SiPage>
  );
}
