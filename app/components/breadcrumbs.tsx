import { Link } from '@remix-run/react';
import { isNumber } from '~/common/sanitize';
import { Sermon } from '~/api/interfaces';
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';

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

interface BreadcrumbProps {
  location: string;
  sermon?: Sermon;
}

/// Note that some breadcrumbs can be inferred directly from the url path (location)
/// while others need to be passed in as props (sermon) because se don't want the
/// breadcrumb navigation to be Home > Sermons > 12345, but rather we want to provide
/// more context like Home > Speakers > Speaker Name > Sermon Title. We will likely
/// need to do some similar hacking for bible routes as well.
export default function Breadcrumbs({ location, sermon }: BreadcrumbProps) {
  const crumbs = location.substring(1).split('/');
  let nav: NavCrumb[] = [{ name: 'Home', linkTo: '/' }];

  if (isSermonCrumb(crumbs) && sermon !== undefined) {
    const speaker = sermon.contributorFullName;
    const sermonName = sermon.title;
    nav.push({
      name: 'Speakers',
      linkTo: '/speakers',
    });
    nav.push({
      name: speaker,
      linkTo: `/speakers/${speaker.toLowerCase().replace(/ /g, '-')}`,
    });
    nav.push({
      name: sermonName,
      linkTo: `/sermons/${crumbs[1]}`,
    });
  } else {
    for (let i = 0; i < crumbs.length; i++) {
      nav.push({
        name: crumbs[i],
        linkTo: `/${crumbs.slice(0, i + 1).join('/')}`,
      });
    }
  }

  return (
    <div className="flex p-3 items-center">
      <ul className="flex flex-row items-center space-x-1">
        {nav.map((crumb, index) => (
          <div className="flex flex-row items-center">
            <a className="pr-1 text-md">{index > 0 && <IoIosArrowForward />}</a>
            <a>
              <span
                key={index}
                className="flex no-underline hover:underline text-sm"
              >
                <Link to={crumb.linkTo}>
                  {crumb.name
                    .replace('-', ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Link>
              </span>
            </a>
          </div>
        ))}
      </ul>
    </div>
  );
}
