import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { BibleTranslation, ListResponse } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { getLanguageName } from '~/common/languages';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import SiPage from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const translations = await fetchApi<ListResponse<BibleTranslation>>(
    `/bible/translations`,
  );

  if ('statusCode' in translations) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return translations;
}

const getBibleGroupedItems = (bibles: BibleTranslation[]) => {
  return bibles.reduce((grouped, bible) => {
    const language = bible.language.toLowerCase();
    if (!grouped[language]) {
      grouped[language] = [];
    }
    grouped[language].push(bible);
    return grouped;
  }, {} as { [key: string]: BibleTranslation[] });
};

export default function Index() {
  const translations = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  return (
    <SiPage>
      <SiSection title={'Bibles'}>
        <>
          <input
            className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
            placeholder="Find a bible..."
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            required
          />
          <GenericList<BibleTranslation>
            items={translations.values.filter((b) => {
              return (
                b.name.toLowerCase().includes(filter) ||
                b.id.toLowerCase().includes(filter)
              );
            })}
            getGroupedItems={getBibleGroupedItems}
            getGroupKeyName={(key: string) => getLanguageName(key)}
            getItemId={(bible: BibleTranslation) => bible.id}
            getItemName={(bible: BibleTranslation) => bible.name}
            getItemLink={(bible: BibleTranslation) =>
              `/bible/${bible.language}/${bible.shortName}`
            }
            columnsClassName="grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
          />
        </>
      </SiSection>
    </SiPage>
  );
}
