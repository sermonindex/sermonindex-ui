import { LoaderFunctionArgs } from '@remix-run/node';
import { json, MetaFunction, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { BibleCommentary, ListResponse } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { getMetaTags } from '~/common/get-meta-tags';
import { getLanguageName } from '~/common/languages';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const commentaries = await fetchApi<ListResponse<BibleCommentary>>(
    `/commentary`,
  );

  if ('statusCode' in commentaries) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return json(commentaries, {
    headers: { 'Cache-Control': 'public, max-age=86400' },
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  const title = 'Bible Commentaries';
  const description =
    'Explore a wide range of Bible commentaries on SermonIndex. Discover insights and teachings from various authors.';
  const url = 'https://sermonindex.net/commentary';

  return getMetaTags({
    title,
    description,
    url,
  });
};

const getCommentaryGroupedItems = (commentaries: BibleCommentary[]) => {
  return commentaries.reduce((grouped, commentary) => {
    const language = commentary.language.toLowerCase();
    if (!grouped[language]) {
      grouped[language] = [];
    }
    grouped[language].push(commentary);
    return grouped;
  }, {} as { [key: string]: BibleCommentary[] });
};

export default function Index() {
  const commentaries = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  return (
    <SiPage>
      <SiSection title={'Commentaries'} count={commentaries.values.length}>
        <>
          {/* Todo: make this component Generic */}
          <input
            className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
            placeholder="Find a commentary..."
            type="search"
            name="search commentaries"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            required
          />
          <GenericList<BibleCommentary>
            items={commentaries.values.filter((c) => {
              return (
                c.name.toLowerCase().includes(filter) ||
                c.id.toLowerCase().includes(filter) ||
                c.englishName.toLowerCase().includes(filter)
              );
            })}
            getGroupedItems={getCommentaryGroupedItems}
            getGroupKeyName={(key: string) => getLanguageName(key)}
            getItemId={(commentary: BibleCommentary) => commentary.id}
            getItemName={(commentary: BibleCommentary) => commentary.name}
            getItemLink={(commentary: BibleCommentary) =>
              `/commentary/${commentary.id}`
            }
            columnsClassName="grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
          />
        </>
      </SiSection>
    </SiPage>
  );
}
