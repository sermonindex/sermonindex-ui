import { Contributor } from '~/api/interfaces';

interface ContributorCardProps {
  contributor: Contributor;
}

export const ContributorCard = ({ contributor }: ContributorCardProps) => {
  return (
    <div className="flex space-x-2 md:space-x-12">
      <img
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-48 float-left rounded-lg bg-slate-100 object-cover mr-2 mb-2"
        src={contributor.imageUrl}
        alt={contributor.fullName}
      />
      <div className="flex items-center space-x-6">
        <div className="flex flex-col mb-6">
          <h3 className="text-xl md:text-3xl font-semibold">
            {contributor.fullName}
          </h3>
          <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-base text-neutral-600 dark:text-neutral-300">
            <span>{contributor.sermonCount} Sermons</span>
            {contributor.bookCount > 0 && (
              <>
                <span>|</span>
                <span>{contributor.bookCount} Books</span>
              </>
            )}
            {contributor.images.length > 0 && (
              <>
                <span>|</span>
                <span>{contributor.images.length} Images</span>
              </>
            )}
          </div>
          <div className="flex pt-3 text-xs md:text-base">
            <span className="line-clamp-3">{contributor.bio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
