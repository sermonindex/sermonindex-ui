import { Contributor } from '~/api/interfaces';

interface ContributorCardProps {
  contributor: Contributor;
}

export const ContributorCard = ({ contributor }: ContributorCardProps) => {
  return (
    <div className="flex justify-between space-x-2 md:space-x-12">
      <div className="flex items-center space-x-6">
        <img
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
          src={contributor.imageUrl}
          alt={contributor.fullName}
        />
        <div className="flex flex-col mb-6">
          <h3 className="text-xl md:text-3xl font-semibold">
            {contributor.fullName}
          </h3>
          <div className="flex items-center space-x-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
            <span>{contributor.sermonCount} Sermons</span>
            {contributor.images.length > 0 && (
              <>
                <span>|</span>
                <span>{contributor.images.length} Images</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
