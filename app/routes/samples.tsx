import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { SiPage } from '~/components/si-page';
import { MiniPlayer, Player } from '~/components/media/player';
import { SiSection } from '~/components/section';
import { useState } from 'react';

export async function loader({ params }: LoaderFunctionArgs) {
  const [popular, recent, featured, videoSermon] = await Promise.all([
    fetchApi<ListResponse<Sermon>>('/sermons/popular'),
    fetchApi<ListResponse<Sermon>>('/sermons/recent'),
    fetchApi<Sermon>('/sermons/featured'),
    fetchApi<Sermon>('/sermons/id/4881'),
  ]);

  if (
    'statusCode' in popular ||
    'statusCode' in recent ||
    'statusCode' in featured ||
    'statusCode' in videoSermon
  ) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { popular, recent, featured, videoSermon };
}

export default function Index() {
  const { popular, recent, featured, videoSermon } =
    useLoaderData<typeof loader>();

  const [sermonDuration, setSermonDuration] = useState<number | null>(null);

  // Callback function to receive the duration from MiniPlayer
  const handleDurationChange = (duration: number) => {
    console.log('Duration received from MiniPlayer:', duration);
    setSermonDuration(duration);
  };

  // Helper to format duration
  const formatDuration = (seconds: number | null): string => {
    if (seconds === null || isNaN(seconds) || seconds <= 0) {
      return '--:--';
    }
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <SiPage>
      <span className="p-4">Example Mini Players</span>
      <SiSection className="w-full bg-si-olive rounded-2xl p-4">
        <ul>
          <li className={'max-w-80'}>
            <span className="p-2">
              Audio Example Mini Player - Time: {formatDuration(sermonDuration)}
            </span>
            <MiniPlayer
              sermon={featured}
              onDurationChange={handleDurationChange}
            />
          </li>
          <li>
            <span className="p-2">
              Example Mini Player - Video Sermon 'max-w-48' - No duration lifted
              out
            </span>
            <div className={'w-full'}>
              <MiniPlayer
                sermon={videoSermon}
                loadStrategy={'play'}
                displayLength={400}
              />
            </div>
          </li>
        </ul>
      </SiSection>

      <span className="p-4">Example New Audio</span>
      <SiSection>
        <Player sermons={[featured]} startTime={0} storageKey={'sample'} />
      </SiSection>

      <span className="p-4">Example New Video</span>
      <SiSection>
        <Player sermons={[videoSermon]} startTime={0} storageKey={'sample'} />
      </SiSection>
    </SiPage>
  );
}
