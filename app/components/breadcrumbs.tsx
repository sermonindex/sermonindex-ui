import { Link } from '@remix-run/react';
import { IoIosArrowForward } from 'react-icons/io';
import { Contributor, Sermon } from '~/api/interfaces';
import { hasContent, isNumber } from '~/common/sanitize';
import { OsisToBookName } from '~/common/bible-constants';
import { isValidLanguage } from '~/common/languages';
import { PostFrontmatter } from '~/routes/blog_.$name';
import { format } from 'date-fns';

interface NavCrumb {
  name: string;
  linkTo: string;
}

/// Check if a split location string array resembles a sermon splat
function isSermonCrumb(crumbs: string[]): boolean {
  return (
    crumbs.length > 1 &&
    crumbs[0] === 'sermons' &&
    isNumber(parseInt(crumbs[1]))
  );
}

function isSpeakerCrumb(crumbs: string[]): boolean {
  return (
    crumbs.length > 1 &&
    crumbs[0] === 'speakers' &&
    !isNumber(parseInt(crumbs[1]))
  );
}

function isBibleCrumb(crumbs: string[]): boolean {
  return crumbs.length > 1 && crumbs[0].toLowerCase() === 'bible';
}

function isBlogPost(crumbs: string[]): boolean {
  return crumbs.length > 1 && crumbs[0].toLowerCase() === 'blog';
}

function isMarkdownPage(crumbs: string[]): boolean {
  return crumbs.length > 1 && crumbs[0].toLowerCase() === 'md';
}

function buildSermonCrumbs(
  crumbs: string[],
  sermon: Sermon,
  nav: NavCrumb[],
): NavCrumb[] {
  const speaker = sermon.contributorFullName;
  const sermonName = sermon.title;
  nav.push({
    name: 'Speakers',
    linkTo: '/speakers',
  });
  nav.push({
    name: speaker,
    // todo: the contributor has a slug, but it's not
    //   available on the sermon type.
    linkTo: `/speakers/${speaker
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/\./g, '')}`,
  });
  nav.push({
    name: sermonName,
    linkTo: `/sermons/${crumbs[1]}`,
  });

  return nav;
}

function buildSpeakerCrumbs(
  crumbs: string[],
  contributor: Contributor,
  nav: NavCrumb[],
): NavCrumb[] {
  nav.push({
    name: 'Speakers',
    linkTo: '/speakers',
  });
  nav.push({
    name: contributor.fullName,
    linkTo: `/speakers/${crumbs[1]}`,
  });

  return nav;
}

function buildBibleCrumbs(crumbs: string[], nav: NavCrumb[]): NavCrumb[] {
  nav.push({
    name: 'Bible',
    linkTo: '/bible',
  });

  // todo: cache last used bible translation
  // translation, language, or "parallel"
  let translation: string = 'BSB';
  let language: string = 'eng';
  if (crumbs.length > 1) {
    if (crumbs[1] !== 'parallel') {
      if (isValidLanguage(crumbs[1])) {
        // This feels dirty. The only other way around this would be to pass some object, like BibleTranslation
        // to the SiPage/Header/Breadcrumbs. The tricky part is that there are various bible routes...
        language = crumbs[1];
        crumbs.splice(1, 1);
      }
      // This index exists because we don't route to /bible/${language}, we
      // always route to the full /bible/${language}/${translation} or deeper
      translation = crumbs[1];
      nav.push({
        name: translation,
        linkTo: `/bible/${language}/${crumbs[1]}`,
      });
    }
    // book
    if (crumbs.length > 2) {
      nav.push({
        name: OsisToBookName[crumbs[2] as keyof typeof OsisToBookName],
        // todo: this link does not route currently
        // linkTo: `/bible/${translation}/${crumbs[2]}`,
        linkTo: '',
      });
      // chapter
      if (crumbs.length > 3) {
        nav.push({
          name: `Chapter ${crumbs[3]}`,
          linkTo: `/bible/${translation}/${crumbs[2]}/${crumbs[3]}`,
        });
        // verse
        if (crumbs.length > 4) {
          nav.push({
            name: `Verse ${crumbs[3]}`,
            linkTo: `/bible/${translation}/${crumbs[2]}/${crumbs[3]}/${crumbs[4]}`,
          });
        }
      }
    }
  }

  return nav;
}

function buildBlogCrumbs(
  crumbs: string[],
  post: PostFrontmatter | undefined,
  nav: NavCrumb[],
): NavCrumb[] {
  nav.push({
    name: 'Blog',
    linkTo: '/blog',
  });
  if (post) {
    let date = format(new Date(post.date), 'MMMM d, yyyy');
    nav.push({
      name: date,
      linkTo: '',
    });
    nav.push({
      name: post.title,
      linkTo: `/blog/${crumbs[1]}`,
    });
  } else {
    nav.push({
      name: crumbs[1].replace(/%20/g, ' ').replace(/-/g, ' '),
      linkTo: `/blog/${crumbs[1]}`,
    });
  }
  return nav;
}

function buildMarkdownCrumbs(crumbs: string[], nav: NavCrumb[]): NavCrumb[] {
  nav.push({
    name: crumbs[1].replace(/%20/g, ' ').replace(/-/g, ' '),
    linkTo: `/md/${crumbs[1]}`,
  });
  return nav;
}

interface BreadcrumbProps {
  location: string;
  sermon?: Sermon;
  contributor?: Contributor;
  post?: PostFrontmatter;
}

/// Note that some breadcrumbs can be inferred directly from the url path (location)
/// while others need to be passed in as props (sermon) because we don't want the
/// breadcrumb navigation to be Home > Sermons > 12345, but rather we want to provide
/// more context like Home > Speakers > Speaker Name > Sermon Title. We will likely
/// need to do some similar hacking for bible routes as well.
export default function Breadcrumbs({
  location,
  sermon,
  contributor,
  post,
}: BreadcrumbProps) {
  const crumbs = location.substring(1).split('/');
  let nav: NavCrumb[] = [{ name: 'Home', linkTo: '/' }];

  if (isSermonCrumb(crumbs) && sermon !== undefined) {
    nav = buildSermonCrumbs(crumbs, sermon, nav);
  } else if (isSpeakerCrumb(crumbs) && contributor !== undefined) {
    nav = buildSpeakerCrumbs(crumbs, contributor, nav);
  } else if (isBibleCrumb(crumbs)) {
    nav = buildBibleCrumbs(crumbs, nav);
  } else if (isBlogPost(crumbs)) {
    nav = buildBlogCrumbs(crumbs, post, nav);
  } else if (isMarkdownPage(crumbs)) {
    nav = buildMarkdownCrumbs(crumbs, nav);
  } else {
    for (let i = 0; i < crumbs.length; i++) {
      nav.push({
        name: crumbs[i]
          .replace(/-/g, ' ')
          .replace(/(?<!')\b\w/g, (l) => l.toUpperCase()),
        linkTo: `/${crumbs.slice(0, i + 1).join('/')}`,
      });
    }
  }

  return (
    <div className="p-3 flex items-center h-auto">
      <ul className="flex items-center space-x-1">
        {nav.map((crumb, index) => (
          <li className="flex items-center" key={`breadcrumb-${index}`}>
            {index > 0 && (
              <span className="pr-1 text-md">
                <IoIosArrowForward />
              </span>
            )}
            {index < nav.length - 1 && hasContent(crumb.linkTo) ? (
              <Link to={crumb.linkTo} className="text-sm hover:underline">
                {crumb.name}
              </Link>
            ) : (
              <span className="text-sm italic">
                {crumb.name
                  .replace('-', ' ')
                  .replace('%20', ' ')
                  .replace(/(?<!')\b\w/g, (l) => l.toUpperCase())}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
