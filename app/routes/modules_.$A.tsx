import { LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { OsisBookId } from '~/common/bible-constants';
import { BookRouteMap } from '~/common/route-maps/books';
import { ChapterRouteMap } from '~/common/route-maps/chapters';

/**
 *
 * A list of old site url patterns mapped to the new routes.
 * This is used to redirect old URLs to the new structure.
 * For example: Links served up by google or other sites
 *
 * /mydownloads -> /speakers
 * /articles -> /speakers
 * /myvideo -> /speakers
 *
 * /bible_books -> /bible/BSB/GEN/1
 *
 * /bible_books/?view=books_list -> /books
 * /bible_books/?view=book&book=67 -> /books/$id/contents
 * /bible_books/?view=book_chapter&chapter=2501 -> /books/$id/contents/$chapter
 *
 * /bible_books/?view=bible&bible=1&verse=5&scripture=1 -> bible/KJV/DEU/1
 * /bible_books/?view=bible&bible=7&verse=16&scripture=3 -> bible/WEB/NEH/3
 *
 * /newbb -> /
 */

enum BibleBookMap {
  BSB, // Berean Standard Bible
  KJV, // King James Version
  ASV, // American Standard Version
  DRV, // Douay-Rheims
  DBY, // Darby Translation
  EMTV, // English Majority Text Version
  WBS, // Noah Webster's Bible
  WEBP, // World English Bible
  YLT, // Young's Literal Translation
}

export const loader: LoaderFunction = ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const { A } = params;

  const url = new URL(request.url);
  const view = url.searchParams.get('view');

  if (A === 'articles' || A === 'mydownloads' || A === 'myvideo') {
    return redirect('/speakers');
  }

  if (A === 'bible_books') {
    if (view === 'bible') {
      const translationId = url.searchParams.get('bible') || '0';
      const bookId = `${parseInt(url.searchParams.get('verse') || '1') - 1}`;
      const chapter = url.searchParams.get('scripture') || '1';

      if (!translationId) {
        return redirect('/bible/BSB/GEN/1');
      } else {
        const translation =
          BibleBookMap[translationId as keyof typeof BibleBookMap] || 'BSB';
        const book = OsisBookId[bookId as keyof typeof OsisBookId] || 'GEN';

        return redirect(`/bible/${translation}/${book}/${chapter}`);
      }
    } else if (view === 'books_list') {
      return redirect('/books');
    } else if (view === 'book') {
      const oldBookId = url.searchParams.get('book') || '1';
      const bookId = BookRouteMap[oldBookId as keyof typeof BookRouteMap];

      if (!bookId) return redirect('/books');

      return redirect(`/books/${bookId}/contents`);
    } else if (view === 'book_chapter') {
      const oldChapterId = url.searchParams.get('chapter') || '1';
      const chapterRoute =
        ChapterRouteMap[oldChapterId as keyof typeof ChapterRouteMap];

      if (!chapterRoute) return redirect('/books');

      return redirect(chapterRoute);
    }

    return redirect('/bible/BSB/GEN/1');
  }

  return redirect('/');
};

export default function Index() {
  return null;
}
