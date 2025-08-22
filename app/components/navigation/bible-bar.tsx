import { Link, useLocation } from '@remix-run/react';
import { getBibleBookId } from '~/common/get-bible-book-id.fn';

interface BibleLink {
  name: string;
  short?: string;
  linkTo: string;
}

function getBibleLinks(pathname: string): { [key: string]: BibleLink } {
  let book, chapter;

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

  const referencePath = book && chapter ? `/${book}/${chapter}` : '';

  return {
    bsb: { name: 'BSB', linkTo: `bible/BSB${referencePath}` },
    kjv: { name: 'KJV', linkTo: `bible/KJV${referencePath}` },
    web: { name: 'WEB', linkTo: `bible/WEBP${referencePath}` },
    ylt: { name: 'YLT', linkTo: `bible/YLT${referencePath}` },
    asv: { name: 'ASV', linkTo: `bible/ASV${referencePath}` },
    bbe: { name: 'BBE', linkTo: `bible/BBE${referencePath}` },
    wmb: { name: 'WMB', linkTo: `bible/WMB${referencePath}` },
    t4t: { name: 'T4T', linkTo: `bible/T4T${referencePath}` },
    dby: { name: 'DBY', linkTo: `bible/DBY${referencePath}` },
    fbv: { name: 'FBV', linkTo: `bible/FBV${referencePath}` },
    ulb: { name: 'ULB', linkTo: `bible/ULB${referencePath}` },
    wbs: { name: 'WBS', linkTo: `bible/WBS${referencePath}` },
    lst: { name: 'LSV', linkTo: `bible/LSV${referencePath}` },
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
