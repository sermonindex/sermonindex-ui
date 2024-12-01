import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Contributor, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { StandardHeader } from '~/common/section';
import { SermonPlayer } from '~/components/player';
import SiPage from '~/components/si-page';
import { SpeakerBio } from '~/components/speaker-bio';

export async function loader({ params }: LoaderFunctionArgs) {
  // todo: need to fetch the speaker bio, icon, etc and add to the loaded data
  const [sermon] = await Promise.all([
    fetchApi<Sermon>(`/sermons/id/${params.id}`),
  ]);

  if ('statusCode' in sermon) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  const contributor = await fetchApi<Contributor>(
    `/contributors/id/${sermon.contributorId}`,
  );

  if ('statusCode' in contributor) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { sermon, contributor };
}

export default function Component() {
  const { sermon, contributor } = useLoaderData<typeof loader>();

  return (
    <SiPage sermon={sermon}>
      <div className={'p-10'}>
        <StandardHeader text={sermon.title} />
        <div className={'p-2'}>
          {/* todo(jdf): handle text only sermons */}
          <SermonPlayer sermon={sermon} />
        </div>

        <div className="flex flex-col sm:flex-row items-start justify-center pt-8 space-x-0 sm:space-x-8">
          <div className="flex-grow sm:w-2/3">
            {/* ... Speaker bio ... */}
            <SpeakerBio contributor={contributor} />
            <Link to={`/speakers/${contributor.fullNameSlug}#sermon-list`}>
              <p className="hover:underline px-4 py-2">
                See all {contributor.sermonCount} sermons by{' '}
                {contributor.fullName}
              </p>
            </Link>
          </div>
          <div className="flex-grow sm:w-1/3">
            {/* ... Scriptures content ... */}
            <StandardHeader text={'Scriptures'} />
            <div className="p-4">
              {Array.isArray(sermon.bibleReferences) &&
              sermon.bibleReferences.length > 0 ? (
                sermon.bibleReferences.map((reference, index) => (
                  <div key={index}>{reference}</div>
                ))
              ) : (
                <div>No references available.</div>
              )}
            </div>
          </div>
        </div>
        <div>
          {/* ... Sermon summary ... */}
          <div className={'pt-8'}>
            <StandardHeader text={'Sermon Summary'} />
            <div className={'p-4'}>
              <p>{sermon.description}</p>
            </div>
          </div>
          {/* ... Sermon transcript ... */}
          <div className={'pt-8'}>
            <StandardHeader text={'Sermon Transcription'} />
            <div className={'p-4'}>
              <p className="whitespace-pre-line">{sermon.transcript}</p>
            </div>
          </div>
        </div>
      </div>
    </SiPage>
  );
}
