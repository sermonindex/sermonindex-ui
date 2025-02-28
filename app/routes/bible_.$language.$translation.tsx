import SiPage from '~/components/si-page';
import { SiSection } from '~/components/section';
import { LoaderFunctionArgs } from '@remix-run/node';
import { fetchApi } from '~/api/sdk';
import { useLoaderData } from '@remix-run/react';
import { BibleTranslation } from '~/api/interfaces';
import { BookList } from '~/components/book-list';

export async function loader({ params }: LoaderFunctionArgs) {
  const { _, language, translation } = params;
  const bible = await fetchApi<BibleTranslation>(
    `/bible/${language}/${translation}`,
  );

  if ('statusCode' in bible) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return bible;
}

export default function Index() {
  const bible = useLoaderData<typeof loader>();

  return (
    <SiPage>
      <SiSection title={bible.name}>
        {!bible.isComplete && (
          <p className="p-4 italic text-sm">
            This translation does not include the full biblical canon.
          </p>
        )}
        <BookList books={bible.books} translation={bible.shortName} />
      </SiSection>
    </SiPage>
  );
}
