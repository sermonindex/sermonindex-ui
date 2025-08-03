import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { BookNameToOsis, OsisBookId } from '~/common/bible-constants';
import { AudioContributorRouteMap } from '~/common/route-maps/audio-contributors';
import { AudioSermonRouteMap } from '~/common/route-maps/audio-sermons';
import { ContributorImageRouteMap } from '~/common/route-maps/images';
import { TextContributorRouteMap } from '~/common/route-maps/text-contributors';
import { TextSermonRouteMap } from '~/common/route-maps/text-sermons';
import { TopicRouteMap } from '~/common/route-maps/topics';
import { VideoContributorRouteMap } from '~/common/route-maps/video-contributors';
import { VideoSermonRouteMap } from '~/common/route-maps/video-sermons';

/**
 *
 * A list of old site url patterns mapped to the new routes.
 * This is used to redirect old URLs to the new structure.
 * For example: Links served up by google or other sites
 *
 * /mydownloads/viewcat.php?cid=45 -> /speaker/$slug
 * /mydownloads/visit.php?lid=1123 -> /sermon/$id
 * /mydownloads/singlefile.php?lid=1233 -> /sermon/$id
 *
 * /mydownloads/scr_index.php?act=topicsList -> /topics
 * /mydownloads/scr_index.php?act=topicSermons&topic=Alone With God&page=0 -> topics/$slug
 * /mydownloads/scr_index.php?act=booksList -> bible/BSB
 * /mydownloads/scr_index.php?act=bookSermons&book=Nehemiah&page=0 -> bible/BSB/NEH/1
 * /mydownloads/scr_index.php?act=scriptureSermons&verse=19&scripture1=8&scripture2=1&scr_submit=View+sermons -> bible/parallel/PSA/8/1
 *
 * /articles/index.php?view=category&cid=76 -> /speaker/$slug
 * /articles/index.php?view=article&aid=1120 -> /sermon/$id
 *
 * /myvideo/viewcat.php?cid=7 -> /speakers/$slug
 * /myvideo/photo.php?lid=3061 -> /sermon/$id
 *
 * /myalbum/index.php -> /speakers
 * /myalbum/photo.php?lid=75 -> /speakers/$slug#images
 *
 * /newbb/viewforum.php -> /
 * /newbb/viewtopic.php -> /
 */

export const loader: LoaderFunction = ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const { A, B } = params;

  const url = new URL(request.url);

  if (A === 'mydownloads') {
    if (B === 'viewcat.php') {
      const cid = url.searchParams.get('cid');
      const slug =
        AudioContributorRouteMap[cid as keyof typeof AudioContributorRouteMap];

      if (!slug) return redirect('/speakers');

      return redirect(`/speakers/${slug}`);
    } else if (B === 'visit.php' || B === 'singlefile.php') {
      const lid = url.searchParams.get('lid');
      const sermonId =
        AudioSermonRouteMap[lid as keyof typeof AudioSermonRouteMap];

      if (!sermonId) return redirect('/sermons');

      return redirect(`/sermons/${sermonId}`);
    } else if (B === 'scr_index.php') {
      const act = url.searchParams.get('act');

      if (act === 'topicsList') {
        return redirect('/topics');
      } else if (act === 'topicSermons') {
        const topic = url.searchParams.get('topic');
        const slug = TopicRouteMap[topic as keyof typeof TopicRouteMap];

        if (!slug) return redirect('/topics');

        return redirect(`/topics/${slug}`);
      } else if (act === 'booksList') {
        return redirect('/bible/BSB');
      } else if (act === 'bookSermons') {
        const book = url.searchParams.get('book');
        const bookId = BookNameToOsis[book as keyof typeof BookNameToOsis];

        if (!bookId) return redirect('/bible/BSB/GEN/1');

        return redirect(`/bible/BSB/${bookId}/1`);
      } else if (act === 'scriptureSermons') {
        const bookId = `${parseInt(url.searchParams.get('verse') || '1') - 1}`;
        const book = OsisBookId[bookId as keyof typeof OsisBookId] || 'GEN';
        const chapter = url.searchParams.get('scripture1') || '1';
        const verse = url.searchParams.get('scripture2') || '1';

        return redirect(`/bible/parallel/${book}/${chapter}/${verse}`);
      }

      return redirect('/');
    }

    return redirect('/speakers');
  } else if (A === 'articles') {
    if (B === 'index.php') {
      const view = url.searchParams.get('view');
      if (view === 'category') {
        const cid = url.searchParams.get('cid');
        const slug =
          TextContributorRouteMap[cid as keyof typeof TextContributorRouteMap];

        if (!slug) return redirect('/speakers');

        return redirect(`/speakers/${slug}`);
      } else if (view === 'article') {
        const aid = url.searchParams.get('aid');
        const sermonId =
          TextSermonRouteMap[aid as keyof typeof TextSermonRouteMap];

        if (!sermonId) return redirect('/sermons');

        return redirect(`/sermons/${sermonId}`);
      }
    }
  } else if (A === 'myvideo') {
    if (B === 'viewcat.php') {
      const cid = url.searchParams.get('cid');
      const slug =
        VideoContributorRouteMap[cid as keyof typeof VideoContributorRouteMap];

      if (!slug) return redirect('/speakers');

      return redirect(`/speakers/${slug}`);
    } else if (B === 'photo.php') {
      const lid = url.searchParams.get('lid');
      const sermonId =
        VideoSermonRouteMap[lid as keyof typeof VideoSermonRouteMap];

      if (!sermonId) return redirect('/sermons');

      return redirect(`/sermons/${sermonId}`);
    }
  } else if (A === 'myalbum') {
    if (B === 'index.php') return redirect('/speakers');
    else if (B === 'photo.php') {
      const lid = url.searchParams.get('lid');
      const slug =
        ContributorImageRouteMap[lid as keyof typeof ContributorImageRouteMap];

      if (!slug) return redirect('/speakers');

      // TODO: Add anchor to images tab
      return redirect(`/speakers/${slug}`);
    }
  }

  return redirect('/');
};

export default function Index() {
  return null;
}
