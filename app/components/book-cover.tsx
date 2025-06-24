import { IconContext } from 'react-icons';
import { MdHeadphones } from 'react-icons/md';
import { BookInfo, MediaType } from '~/api/interfaces';

export interface BookCoverProps {
  book: BookInfo;
}

export const BookCover = ({ book }: BookCoverProps) => {
  return (
    <div className="relative flex bg-si-brown dark:bg-si-official-light text-nuetral-900 dark:text-neutral-900 w-40 h-56 md:w-44 md:h-60 rounded-lg hover:cursor-pointer hover:scale-110 transition-transform duration-200">
      {book.mediaType === MediaType.Audio && (
        <div className="absolute -top-0 -right-0 bg-neutral-300 rounded-bl-lg rounded-tr-lg p-1">
          <IconContext.Provider value={{ className: 'w-6 h-6' }}>
            <MdHeadphones />
          </IconContext.Provider>
        </div>
      )}

      <div className="flex flex-col justify-between w-full border-si-dark border-2 m-2 rounded-lg">
        <span className="pl-2 pt-4 md:pt-6 font-bold font-serif ">
          {book.title}
        </span>
        <span className="pl-2 pb-2 font-serif">{book.contributorFullName}</span>
      </div>
    </div>
  );
};
