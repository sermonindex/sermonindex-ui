import { getBibleBookId } from '~/common/get-bible-book-id.fn';
import { Link, useLocation } from '@remix-run/react';

interface BibleLink {
  name: string;
  short?: string;
  linkTo: string;
}

function getBibleLinks(pathname: string): { [key: string]: BibleLink } {
  let book = 'GEN';
  let chapter = 1;

  // If they are on a bible page already, then they should go to the same book/chapter
  if (pathname.includes('bible')) {
    const parts = pathname.split('/');

    if (parts.length >= 5) {
      book = getBibleBookId(parts[3]);

      let number = parseInt(parts[4]);
      if (!isNaN(number)) {
        chapter = number;
      }
    }
  }

  return {
    bsb: { name: 'BSB', linkTo: `bible/BSB/${book}/${chapter}` },
    kjv: { name: 'KJV', linkTo: `bible/KJV/${book}/${chapter}` },
    web: { name: 'WEB', linkTo: `bible/WEBP/${book}/${chapter}` },
    ylt: { name: 'YLT', linkTo: `bible/YLT/${book}/${chapter}` },
    asv: { name: 'ASV', linkTo: `bible/ASV/${book}/${chapter}` },
    bbe: { name: 'BBE', linkTo: `bible/BBE/${book}/${chapter}` },
    gnv: { name: 'GNV', linkTo: `bible/GNV/${book}/${chapter}` },
    t4t: { name: 'T4T', linkTo: `bible/T4T/${book}/${chapter}` },
    our: { name: 'OUR', linkTo: `bible/OUR/${book}/${chapter}` },
    fbv: { name: 'FBV', linkTo: `bible/FBV/${book}/${chapter}` },
    ulb: { name: 'ULB', linkTo: `bible/ULB/${book}/${chapter}` },
    wbs: { name: 'WBS', linkTo: `bible/WBS/${book}/${chapter}` },
    lst: { name: 'LSV', linkTo: `bible/LSV/${book}/${chapter}` },
  };
}

export const BibleBar = () => {
  const location = useLocation();
  const bibleLinks = getBibleLinks(location.pathname);

  return (
    <div className="flex items-center justify-center h-11 px-4 md:px-8 py-2 bg-si-light dark:bg-si-dark">
      <div className="overflow-x-auto whitespace-nowrap w-full no-scrollbar">
        <div className="flex justify-center space-x-6 text-lg">
          {Object.values(bibleLinks).map((link: BibleLink) => {
            if (link.linkTo === '') {
              return <span key={link.name}>{link.name}</span>;
            }
            // TODO: Tooltip translation with full name
            return (
              <Link
                className={`block border-b-2 border-transparent hover:border-si-accent`}
                key={link.name}
                to={`/${link.linkTo}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
