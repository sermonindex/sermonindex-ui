import SiPage from '~/components/si-page';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { fetchApi } from '~/api/sdk';
import { BibleCommentary, ListResponse } from '~/api/interfaces';
import { SiSection } from '~/common/section';
import { useState } from 'react';
import { getLanguageName } from '~/common/languages';
import { GenericList } from '~/components/generic-list';

export async function loader({ params }: LoaderFunctionArgs) {
  const commentaries = await fetchApi<BibleCommentary[]>(`/commentary`);

  if ('statusCode' in commentaries) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return commentaries;
}

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
      <SiSection title={'Commentaries'}>
        <>
          {/* Todo: make this component Generic */}
          <input
            className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
            placeholder="Find a commentary..."
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            required
          />
          <GenericList<BibleCommentary>
            items={commentaries.filter((c) => {
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
            getItemLink={
              (commentary: BibleCommentary) => ''
              // todo: something like `/commentary/${commentary.language}/${commentary.id}` ?
            }
          />
        </>
      </SiSection>
    </SiPage>
  );
}
