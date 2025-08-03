import { LoaderFunctionArgs } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';
import { BibleBook, CommentaryBook } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { isOldTestament } from '~/common/get-bible-book-id.fn';
import { getMetaTags } from '~/common/get-meta-tags';
import { GenericList } from '~/components/generic-list';
import { SiSection } from '~/components/section';
import { SiPage } from '~/components/si-page';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const commentary = await fetchApi<any>(`/commentary/eng/${id}`);

  if ('statusCode' in commentary) {
    throw new Response('Oh no! Something went wrong!', {
      status: 500,
    });
  }

  return { commentary };
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title = `${data?.commentary.name}`;
  const description =
    'Explore commentary on the Bible by various authors on SermonIndex.';
  const url = `https://sermonindex.net/commentary/${params.id}`;

  return getMetaTags({
    title,
    description,
    url,
  });
};

const getBibleBookGroupedItems = (books: CommentaryBook[]) => {
  return books.reduce((grouped, book) => {
    const canon = isOldTestament(book.name) ? 'Old Testament' : 'New Testament';
    if (!grouped[canon]) {
      grouped[canon] = [];
    }
    grouped[canon].push(book);
    return grouped;
  }, {} as { [key: string]: CommentaryBook[] });
};

export default function Index() {
  const { commentary } = useLoaderData<typeof loader>();

  return (
    <SiPage>
      <SiSection title={commentary.name}>
        <GenericList<CommentaryBook>
          items={commentary.books}
          getGroupedItems={getBibleBookGroupedItems}
          getGroupKeyName={(key: string) => key}
          getItemId={(book: CommentaryBook) => book.id}
          getItemName={(book: CommentaryBook) => book.name}
          getItemLink={(book: CommentaryBook) =>
            `/commentary/${commentary.id}/${book.id}/1`
          }
          getItemCount={(book: BibleBook) => book.numberOfChapters}
          columnsClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />
      </SiSection>
    </SiPage>
  );
}
