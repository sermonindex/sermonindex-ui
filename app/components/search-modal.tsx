import { Link } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaSearch } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { ImBubbles } from 'react-icons/im';
import { RiGalleryView2 } from 'react-icons/ri';
import {
  Contributor,
  ListPaginatedResponse,
  ListResponse,
  MediaType,
  SermonInfo,
  Topic,
} from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { formatDuration } from '~/common/format-duration.fn';
import { formatNumber } from '~/common/format-number';
import { Spinner } from '~/components/spinner';
import { MediaIcon } from './media-icon';

interface SearchModalSectionProps {
  heading: string;
  children: React.ReactNode;
}

const SearchModalSection = ({ heading, children }: SearchModalSectionProps) => {
  return (
    <div className="p-2 border-b border-neutral-200 dark:border-neutral-600">
      <h3 className="text-xs font-semibold mb-1">{heading}</h3>
      <ul>{children}</ul>
    </div>
  );
};

export const SearchModal = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sermons, setSermons] = useState<SermonInfo[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const modalRef: React.RefObject<HTMLDivElement> = useRef(null);
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  const fetchData = async () => {
    fetchApi<ListResponse<Topic>>('/topics', {
      name: input,
      sortBy: 'sermons',
      sortOrder: 'desc',
    }).then((response) => {
      if ('statusCode' in response) return;

      setTopics(response.values);
      setIsLoading(false);
    });

    fetchApi<ListResponse<Contributor>>('/contributors', {
      fullName: input,
      sortBy: 'sermons',
      sortOrder: 'desc',
    }).then((response) => {
      if ('statusCode' in response) return;

      setContributors(response.values);
      setIsLoading(false);
    });

    fetchApi<ListPaginatedResponse<SermonInfo>>('/sermons', {
      title: input,
      limit: 10,
    }).then((response) => {
      if ('statusCode' in response) return;

      setSermons(response.values);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (!input) {
      setSermons([]);
      setTopics([]);
      setContributors([]);
      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(() => fetchData(), 750));
  }, [input]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsLoading(false);
        setInput('');
        setSermons([]);
        setTopics([]);
        setContributors([]);
      }
    };
    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, [modalRef]);

  return (
    <div className="relative">
      {/* Search Placeholder */}
      <div onClick={() => setIsOpen(!isOpen)}>
        <div className="hidden md:flex items-center space-x-3 p-1 w-64 text-sm lg:text-base text-neutral-500 bg-neutral-50 border border-neutral-300 hover:cursor-pointer rounded-full">
          <IconContext.Provider value={{ className: 'ml-1 text-neutral-500' }}>
            <FaSearch />
          </IconContext.Provider>
          <span className="">Search SermonIndex</span>
        </div>
        <div className="flex md:hidden text-white">
          <FaSearch />
        </div>
      </div>

      {/* Modal */}
      <div
        className={`${
          isOpen ? '' : 'hidden'
        } fixed inset-0 z-50 flex justify-center items-start pt-[4rem] px-1 md:px-0`}
      >
        <div className="relative w-full max-w-2xl" ref={modalRef}>
          <div className="bg-si-light dark:bg-si-slate rounded-lg shadow-sm h-[500px] flex flex-col overflow-hidden">
            {/* Sticky Search Bar */}
            <div className="sticky top-0 bg-si-light dark:bg-si-slate z-10 px-4 py-3 border-b border-neutral-200 dark:border-neutral-600">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  ref={inputRef}
                  className="block w-full p-2 ps-10 text-sm text-neutral-900 border border-neutral-300 rounded-lg bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                  placeholder="Search SermonIndex..."
                  value={input}
                  onInput={(e) => setInput(e.currentTarget.value)}
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              {(!input ||
                (!isLoading &&
                  topics.length === 0 &&
                  contributors.length === 0 &&
                  sermons.length === 0)) && (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    No results found
                  </span>
                </div>
              )}
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Spinner />
                </div>
              )}
              {topics.length > 0 && (
                <SearchModalSection heading="Topics">
                  {topics.slice(0, 3).map((topic, index) => (
                    <li key={index}>
                      <Link to={`/topics/${topic.slug}`} reloadDocument={true}>
                        <div className="flex items-center space-x-2 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                          <span className="w-4 h-4 text-neutral-500 dark:text-neutral-400">
                            <ImBubbles />
                          </span>
                          <div className="text-sm">{topic.name}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </SearchModalSection>
              )}
              {contributors.length > 0 && (
                <SearchModalSection heading="Speakers">
                  {contributors.slice(0, 2).map((contributor, index) => (
                    <li key={index}>
                      <Link
                        to={`/speakers/${contributor.fullNameSlug}`}
                        reloadDocument={true}
                      >
                        <div className="flex items-center space-x-2 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                          <img
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            src={contributor.imageUrl}
                            alt={contributor.fullName}
                          />
                          <div>
                            <div className="text-xs">
                              {contributor.fullName}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {contributor.sermonCount} Sermons
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </SearchModalSection>
              )}
              {sermons.length > 0 && (
                <SearchModalSection heading="Sermons">
                  {sermons.map((sermon, index) => (
                    <li key={index}>
                      <Link to={`/sermons/${sermon.id}`} reloadDocument={true}>
                        <div className="flex justify-between space-x-2 md:space-x-12 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                          <div className="flex items-center space-x-2 p-2">
                            <img
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              src={sermon.contributorImageUrl}
                              alt={sermon.contributorFullName}
                            />
                            <div>
                              <div className="text-xs">{sermon.title}</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                by {sermon.contributorFullName}
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:flex space-x-3 items-center pr-2 text-xs text-neutral-500 dark:text-neutral-200">
                            <span className="flex items items-center">
                              {formatNumber(sermon.hits)}
                              <IconContext.Provider
                                value={{ className: 'ml-1 w-4 h-4' }}
                              >
                                <FiDownload />
                              </IconContext.Provider>
                            </span>
                            {sermon.mediaType !== MediaType.Text && (
                              <span>{formatDuration(sermon.duration)}</span>
                            )}
                            <IconContext.Provider
                              value={{ className: 'w-4 h-4' }}
                            >
                              <MediaIcon mediaType={sermon.mediaType} />
                            </IconContext.Provider>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li key={'search-all-sermons'}>
                    <Link to={`/sermons?title=${input}`} reloadDocument={true}>
                      <div className="flex items-center space-x-2 px-3 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                        <span className="w-4 h-4 text-neutral-500 dark:text-neutral-400">
                          <RiGalleryView2 />
                        </span>
                        <span className="text-sm">
                          Search all sermons for {`'${input}'`}
                        </span>
                      </div>
                    </Link>
                  </li>
                </SearchModalSection>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="bg-neutral-600/60 dark:bg-neutral-500/60 fixed w-full h-screen z-40 top-0 left-0"></div>
      )}
    </div>
  );
};
