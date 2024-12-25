import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Contributor, Sermon, getSermonType } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { hasContent } from '~/common/sanitize';
import { ClickableText, StandardHeader } from '~/common/section';
import { SermonPlayer } from '~/components/player';
import SiPage from '~/components/si-page';
import { SpeakerBio } from '~/components/speaker-bio';

import { SermonDownload } from '~/components/sermon-download';

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
  const sermonType = getSermonType(sermon);
  return (
    <SiPage>
      <div className="p-10">
        {/* Only show this div if sermonType is Audio or Video */}
        {['Audio', 'Video'].includes(sermonType) && (
          <div>
            <StandardHeader text={sermon.title} />
            <div className="p-2">
              <SermonPlayer sermon={sermon} />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start justify-center pt-8 space-x-0 sm:space-x-8">
          <div className="flex-grow sm:w-2/3">
            {/* ... Speaker bio ... */}
            <SpeakerBio contributor={contributor} />
            <div className="px-4 py-2">
              <Link to={`/speakers/${contributor.fullNameSlug}#sermon-list`}>
                <ClickableText>
                  See all {contributor.sermonCount} sermons by{' '}
                  {contributor.fullName}
                </ClickableText>
              </Link>
            </div>
          </div>

          <div className="flex-grow sm:w-1/3">
            {/* ... Download content ... */}
            <div>
              <StandardHeader text="Download" />
              <SermonDownload sermon={sermon} />
            </div>

            {/* ... Topics content ... */}
            <StandardHeader
              text={sermon.topics.length > 1 ? 'Topics' : 'Topic'}
            />
            <div className="p-4">
              {Array.isArray(sermon.topics) && sermon.topics.length > 0 ? (
                sermon.topics.map((topic, index) => (
                  <div key={index}>
                    <Link to={`/topics/${topic.toLowerCase()}`}>
                      <ClickableText>{topic}</ClickableText>
                    </Link>
                  </div>
                ))
              ) : (
                <div>No topics available.</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start justify-center pt-8 space-x-0 sm:space-x-8">
          <div className="flex-grow sm:w-2/3">
            {/* ... Sermon summary ... */}
            {hasContent(sermon.description) && (
              <div id="sermon-summary">
                <StandardHeader text={'Sermon Summary'} />
                <div className={'p-4'}>
                  <p>{sermon.description}</p>
                </div>
              </div>
            )}
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
        {/* ... Sermon transcript ... */}
        <div className={'pt-8'} id="sermon-transcript">
          <StandardHeader
            text={sermonType === 'Text' ? sermon.title : 'Sermon Transcription'}
          />
          <div className={'p-4'}>
            {hasContent(sermon.transcript) ? (
              <p className="whitespace-pre-line">{sermon.transcript}</p>
            ) : (
              <p>No sermon transcription available.</p>
            )}
          </div>
        </div>
      </div>
    </SiPage>
  );
}
