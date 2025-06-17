import { SiPage } from '~/components/si-page';
import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { fetchApi } from '~/api/sdk';
import { Contributor, Hymn, ListResponse, Sermon } from '~/api/interfaces';
import { useLoaderData } from '@remix-run/react';
import { SiSection } from '~/components/section';
import { Player } from '~/components/media/player';
import { SpeakerBio } from '~/components/speaker-bio';
import React from 'react';

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

export default function Index() {
  const { songs, artist } = useLoaderData<typeof loader>();

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
      <SiSection title={artist.fullName} sharesRightPadding={true}>
        <SpeakerBio contributor={artist} seeAllLinkVisible={true} />
      </SiSection>
      <SiSection title={'Songs'}>
        <Player sermons={sermons} />
      </SiSection>
    </SiPage>
  );
}
