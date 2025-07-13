import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Contributor, MediaType, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { hasContent } from '~/common/sanitize';
import { ClickableText, SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';
import { SpeakerBio } from '~/components/speaker-bio';

import React, { useEffect } from 'react';
import { linkifyScripture } from '~/components/linkify-scripture';
import { Player } from '~/components/media/player';
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
    `/contributors/slug/${sermon.contributorSlug}`,
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

  useEffect(() => {
    if (!sermon || sermon.mediaType != MediaType.Text) return;

    const incrementViewCount = async () => {
      try {
        await fetchApi(`/sermons/viewed/id/${sermon.id}`, {}, 'POST');
      } catch (error) {
        console.error('Failed to increment sermon view count:', error);
      }
    };
    const timer = setTimeout(incrementViewCount, 15_000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SiPage sermon={sermon}>
      {/* Only show this div if MediaType is Audio or Video */}
      {sermon.mediaType != MediaType.Text && <Player sermons={[sermon]} />}

      <div className="flex flex-col sm:flex-row items-start justify-center">
        <div className="flex-grow sm:w-2/3">
          {/* ... Speaker bio ... */}
          <SiSection title={contributor.fullName} sharesRightPadding={true}>
            <SpeakerBio contributor={contributor} seeAllLinkVisible={true} />
          </SiSection>
        </div>

        <div className="flex-grow sm:w-1/3">
          {/* ... Download content ... */}
          <SiSection title="Download" sharesLeftPadding={true}>
            <SermonDownload sermon={sermon} />
          </SiSection>

          {/* ... Topics content ... */}
          <SiSection
            title={sermon.topics.length > 1 ? 'Topics' : 'Topic'}
            sharesLeftPadding={true}
          >
            {Array.isArray(sermon.topics) && sermon.topics.length > 0 ? (
              sermon.topics.map((topic, index) => (
                <div key={index}>
                  <Link to={`/topics/${topic.slug}`}>
                    <ClickableText>{topic.name}</ClickableText>
                  </Link>
                </div>
              ))
            ) : (
              <div>No topics available.</div>
            )}
          </SiSection>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start justify-center">
        <div className="flex-grow sm:w-2/3">
          {/* ... Sermon summary ... */}
          {hasContent(sermon.description) && (
            <SiSection
              title="Sermon Summary"
              tag="sermon-summary"
              sharesRightPadding={true}
            >
              {hasContent(sermon.description) ? (
                <p className="whitespace-pre-line">
                  {linkifyScripture(sermon.description).map((part, index) => (
                    <React.Fragment key={index}>{part}</React.Fragment>
                  ))}
                </p>
              ) : (
                <p>No sermon summary available.</p>
              )}
            </SiSection>
          )}
        </div>
        <div className="flex-grow sm:w-1/3">
          {/* ... Scriptures content ... */}
          <SiSection title="Scriptures" sharesLeftPadding={true}>
            {Array.isArray(sermon.bibleReferences) &&
            sermon.bibleReferences.length > 0 ? (
              sermon.bibleReferences.map((reference, index) => (
                <div
                  key={index}
                  className="hover:cursor-pointer hover:underline"
                >
                  <Link
                    to={`/bible/parallel/${reference.book}/${reference.startChapter}/${reference.startVerse}`}
                  >
                    <ClickableText>{reference.text}</ClickableText>
                  </Link>
                </div>
              ))
            ) : (
              <div>No references available.</div>
            )}
          </SiSection>
        </div>
      </div>
      {/* ... Sermon transcript ... */}
      <SiSection
        title={
          sermon.mediaType === MediaType.Text
            ? sermon.title
            : 'Sermon Transcription'
        }
        tag="sermon-transcript"
      >
        {hasContent(sermon.transcript) ? (
          <p className="whitespace-pre-line">
            {linkifyScripture(sermon.transcript).map((part, index) => (
              <React.Fragment key={index}>{part}</React.Fragment>
            ))}
          </p>
        ) : (
          <p>No sermon transcription available.</p>
        )}
      </SiSection>
    </SiPage>
  );
}
