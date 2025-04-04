import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { BibleBook, BibleTranslation } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { isOldTestament } from '~/common/get-bible-book-id.fn';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import SiPage from '~/components/si-page';

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

const getBibleBookGroupedItems = (books: BibleBook[]) => {
  return books.reduce((grouped, book) => {
    const canon = isOldTestament(book.name) ? 'Old Testament' : 'New Testament';
    if (!grouped[canon]) {
      grouped[canon] = [];
    }
    grouped[canon].push(book);
    return grouped;
  }, {} as { [key: string]: BibleBook[] });
};

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
        <GenericList<BibleBook>
          items={bible.books}
          getGroupedItems={getBibleBookGroupedItems}
          getGroupKeyName={(key: string) => key}
          getItemId={(book: BibleBook) => book.id}
          getItemName={(book: BibleBook) => book.name}
          getItemLink={(book: BibleBook) =>
            `/bible/${bible.shortName}/${book.id}/1`
          }
          getItemCount={(book: BibleBook) => book.numberOfChapters}
          columnsClassName="grid-cols-1 md:grid-cols-2"
        />
      </SiSection>
    </SiPage>
  );
}
