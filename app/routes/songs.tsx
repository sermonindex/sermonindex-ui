import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Hymn, ListResponse } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { getMetaTags } from '~/common/get-meta-tags';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const [songs] = await Promise.all([fetchApi<ListResponse<Hymn>>('/hymns')]);

  if ('statusCode' in songs) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { songs };
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title = 'Hymns, Songs, and Spiritual Songs';
  const description = 'A collection of hymns and songs on SermonIndex.';
  const url = 'https://sermonindex.net/songs';

  return getMetaTags({
    title,
    description,
    url,
  });
};

export interface Artist {
  name: string;
  slug: string;
  count: number;
}

const groupSongsByArtist = (songs: Artist[]) => {
  return songs.reduce((grouped, artist) => {
    const letter = artist.name[0].toLowerCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(artist);
    return grouped;
  }, {} as { [key: string]: Artist[] });
};

export default function Index() {
  const { songs } = useLoaderData<typeof loader>();

  const artists: Artist[] = songs.values.reduce((acc: Artist[], song: Hymn) => {
    const existingArtist = acc.find(
      (artist) => artist.slug === song.contributorSlug,
    );
    if (existingArtist) {
      existingArtist.count++;
    } else {
      acc.push({
        name: song.contributorFullName,
        slug: song.contributorSlug,
        count: 1,
      });
    }
    return acc;
  }, []);
  const [filter, setFilter] = useState<string>('');
  let filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(filter),
  );

  return (
    <SiPage>
      <SiSection title="Song Artists" count={artists.length}>
        <input
          className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-black"
          placeholder="Find an artist or group..."
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
        />
        <GenericList<Artist>
          items={filteredArtists}
          getGroupedItems={groupSongsByArtist}
          getGroupKeyName={(key: string) => key}
          getItemId={(artist: Artist) => artist.slug}
          getItemName={(artist: Artist) => `${artist.name} (${artist.count})`}
          getItemLink={(artist: Artist) => `/songs/${artist.slug}`}
          getItemCount={(artist: Artist) => artist.count}
          sortOrder={'asc'}
        />
      </SiSection>
    </SiPage>
  );
}
