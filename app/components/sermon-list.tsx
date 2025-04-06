import { Link } from '@remix-run/react';
import { SermonInfo } from '~/api/interfaces';
import { SermonCard } from './sermon-card';

export interface SermonListProps {
  sermons: SermonInfo[];
  showTopic?: boolean;
  showContributor?: boolean;
}

export const SermonList = ({ sermons, showContributor }: SermonListProps) => {
  if (sermons.length === 0) {
    return <div>No sermons found</div>;
  }

  return (
    <ul>
      {sermons.map((sermon) => (
        <Link to={`/sermons/${sermon.id}`} key={sermon.id}>
          <li className="pb-2 md:pb-4" key={sermon.id}>
            <SermonCard
              sermon={sermon}
              showContributor={showContributor}
              showMediaPlayer={false}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200 ease-in-out"
            />
          </li>
        </Link>
      ))}
    </ul>
  );
};
