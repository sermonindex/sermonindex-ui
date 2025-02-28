import SiPage from '~/components/si-page';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { fetchApi } from '~/api/sdk';
import { BibleTranslation, ListResponse } from '~/api/interfaces';
import { SiSection } from '~/components/section';
import { useState } from 'react';
import { getLanguageName } from '~/common/languages';
import { GenericList } from '~/components/generic-list';

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
          />
        </>
      </SiSection>
    </SiPage>
  );
}
