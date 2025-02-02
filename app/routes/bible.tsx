import SiPage from '~/components/si-page';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { fetchApi } from '~/api/sdk';
import { BibleTranslation, ListResponse } from '~/api/interfaces';
import { SiSection } from '~/common/section';
import { useState } from 'react';
import { BibleList } from '~/components/bible-list';

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

export default function Index() {
  const translations = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('');

  return (
    <SiPage>
      <SiSection title={'Bibles'}>
        <div className="">
          <input
            className="mt-4 bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-si-slate"
            placeholder="Find a bible..."
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            required
          />
          <BibleList
            bibles={translations.values.filter((b) => {
              return (
                b.name.toLowerCase().includes(filter) ||
                b.id.toLowerCase().includes(filter)
              );
            })}
          />
        </div>
      </SiSection>
    </SiPage>
  );
}
