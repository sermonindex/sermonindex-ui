import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, MetaFunction, useLoaderData } from '@remix-run/react';
import { Contributor, MediaType, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { hasContent } from '~/common/sanitize';
import { ClickableText, SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';
import { SpeakerBio } from '~/components/speaker-bio';

import React, { useEffect, useState } from 'react';
import { getMetaTags } from '~/common/get-meta-tags';
import { linkifyScripture } from '~/components/linkify-scripture';
import { Player } from '~/components/media/player';
import { SermonDownload } from '~/components/sermon-download';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

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

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title = `${data?.sermon.title} by ${data?.sermon.contributorFullName}`;
  const description = `Listen, read, download, and share this sermon by ${data?.sermon.contributorFullName} on SermonIndex.`;
  const url = `https://sermonindex.net/sermons/${params.id}`;

  return getMetaTags({
    title,
    description,
    url,
  });
};

enum Tabs {
  Bio = 'Bio',
  Summary = 'Summary',
  Transcript = 'Transcript',
  Download = 'Download',
}

function SermonSummary(summary: string | undefined) {
  return (
    <>
      {hasContent(summary) ? (
        <p className="whitespace-pre-line">
          {linkifyScripture(summary).map((part, index) => (
            <React.Fragment key={index}>{part}</React.Fragment>
          ))}
        </p>
      ) : (
        <p>No sermon summary available.</p>
      )}
    </>
  );
}

function SermonTranscriptSummary(transcript: string | undefined) {
  return (
    <>
      {hasContent(transcript) ? (
        <p className="whitespace-pre-line">
          {linkifyScripture(transcript).map((part, index) => (
            <React.Fragment key={index}>{part}</React.Fragment>
          ))}
        </p>
      ) : (
        <p>No sermon transcription available.</p>
      )}{' '}
    </>
  );
}

export default function Component() {
  const { sermon, contributor } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState(Tabs.Bio);

  useEffect(() => {
    if (!sermon || sermon.mediaType != MediaType.Text) return;

    const incrementViewCount = async () => {
      try {
        await fetchApi(`/sermons/viewed/id/${sermon.id}`, {}, 'POST');
      } catch (error) {
        console.warn('Failed to increment sermon view count:', error);
      }
    };
    const timer = setTimeout(incrementViewCount, 15_000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SiPage sermon={sermon}>
      {/* Desktop View */}
      <div className="hidden lg:block">
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
            <SiSection
              title="Sermon Summary"
              tag="sermon-summary"
              sharesRightPadding={true}
            >
              {SermonSummary(sermon.description)}
            </SiSection>
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
          {SermonTranscriptSummary(sermon.transcript)}
        </SiSection>
      </div>
      {/* Mobile View */}
      <div className="lg:hidden block">
        {/* Only show this div if MediaType is Audio or Video */}
        {sermon.mediaType != MediaType.Text && <Player sermons={[sermon]} />}

        <div className="flex flex-wrap px-2 sm:px-8 py-2 gap-y-2">
          {sermon.topics.map((topic) => (
            <Link
              className="text-black dark:text-white bg-si-olive dark:bg-si-main text-xs font-medium me-2 px-2.5 py-0.5 rounded-md"
              key={topic.slug}
              to={`/topics/${topic.slug}`}
            >
              {topic.name}
            </Link>
          ))}
          {sermon.bibleReferences.map((reference) => (
            <Link
              className="text-slate-800 dark:text-white bg-si-accent text-xs font-medium me-2 px-2.5 py-0.5 rounded-md"
              key={reference.text}
              to={`/bible/parallel/${reference.book}/${reference.startChapter}/${reference.startVerse}`}
            >
              {reference.book} {reference.startChapter}:{reference.startVerse}
            </Link>
          ))}
        </div>

        <TabContainer>
          <TabList>
            {Object.values(Tabs).map((tab, index) => (
              <TabListItem
                title={tab}
                key={index}
                active={tab === activeTab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </TabList>

          <TabContent
            key={Tabs.Bio}
            active={activeTab === Tabs.Bio}
            className="py-4 px-2 md:p-4"
          >
            <SpeakerBio contributor={contributor} seeAllLinkVisible={true} />
          </TabContent>
          <TabContent
            key={Tabs.Summary}
            active={activeTab === Tabs.Summary}
            className="py-4 px-2 md:p-4"
          >
            {SermonSummary(sermon.description)}
          </TabContent>
          <TabContent
            key={Tabs.Transcript}
            active={activeTab === Tabs.Transcript}
            className="py-4 px-2 md:p-4"
          >
            {SermonTranscriptSummary(sermon.transcript)}
          </TabContent>
          <TabContent
            key={Tabs.Download}
            active={activeTab === Tabs.Download}
            className="py-4 px-2 md:p-4"
          >
            <SermonDownload sermon={sermon} />
          </TabContent>
        </TabContainer>
      </div>
    </SiPage>
  );
}
