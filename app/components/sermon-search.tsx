import { Link } from '@remix-run/react';
import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { FaSearch } from 'react-icons/fa';
import {
  DropdownIndicatorProps,
  MenuListProps,
  MenuProps,
  OptionProps,
  components,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import { BibleVerse, ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';
import { OsisToBookName } from '~/common/bible-constants';
import { classNames } from '~/common/classnames.fn';

class SermonOption {
  value!: number;
  title!: string;
  speaker!: string;

  constructor(data: SermonOption) {
    Object.assign(this, data);
  }
}

class BibleOption {
  book!: string;
  chapter!: number;
  verse!: number;
  text!: string;

  constructor(data: BibleOption) {
    Object.assign(this, data);
  }
}

enum SearchTabs {
  Sermon = 'sermons',
  Bible = 'bible',
}

type SearchOption = SermonOption | BibleOption;

// TODO: Add debounce to prevent too many requests
// TODO: Search bible references instead of just text
// TODO: Lazy load adjacent tabs

export const SermonSearch = () => {
  const [tab, setTab] = useState<SearchTabs>(SearchTabs.Sermon);

  const loadSermons = async (inputValue: string) => {
    const sermons = await fetchApi<ListResponse<Sermon>>(
      `/sermons/search?title=${inputValue}`,
    );
    if ('statusCode' in sermons) return [];

    return sermons.values.map(
      (sermon) =>
        new SermonOption({
          value: sermon.id,
          title: sermon.title,
          speaker: sermon.contributorFullName,
        }),
    );
  };

  const loadBible = async (inputValue: string) => {
    const verses = await fetchApi<ListResponse<BibleVerse>>(
      `/bible/eng/BSB/search?text=${inputValue}`,
    );
    if ('statusCode' in verses) return [];

    return verses.values.map(
      (verse) =>
        new BibleOption({
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text,
        }),
    );
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: SearchOption[]) => void,
  ) => {
    if (!inputValue || inputValue.length < 4) return;

    Promise.all([loadSermons(inputValue), loadBible(inputValue)])
      .then(([sermons, verses]) => {
        const combinedOptions = [...sermons, ...verses];
        callback(combinedOptions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        callback([]);
      });
  };

  const Menu = (props: MenuProps<SearchOption, true>) => {
    return (
      <components.Menu {...props}>
        <div className="text-lg text-center border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            {Object.values(SearchTabs).map((t) => (
              <li key={t}>
                <div
                  className={classNames(
                    'inline-block p-4 border-b-2 rounded-t-lg capitalize font-medium',
                    tab === t
                      ? 'active text-si-dark border-si-dark dark:text-si-dark dark:border-si-dark'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-400 dark:hover:text-gray-300',
                  )}
                  onClick={() => setTab(t)}
                >
                  {t}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {props.children}
      </components.Menu>
    );
  };

  const MenuList = (props: MenuListProps<SearchOption, true>) => {
    const filteredChildren = React.Children.toArray(props.children).filter(
      (child) => {
        if (!React.isValidElement(child)) return false;

        if (
          (tab === SearchTabs.Sermon &&
            child.props.data instanceof SermonOption) ||
          (tab === SearchTabs.Bible &&
            child.props.data instanceof BibleOption) ||
          (child.props.children &&
            typeof child.props.children === 'string' &&
            child.props.children === 'Loading...')
        ) {
          return true;
        }
        return false;
      },
    );

    if (filteredChildren.length === 0) {
      return (
        <components.MenuList {...props}>
          <div className="px-3 py-2 text-sm text-gray-500">
            No results found
          </div>
        </components.MenuList>
      );
    }

    return (
      <components.MenuList {...props}>{filteredChildren}</components.MenuList>
    );
  };

  const DropdownIndicator = (
    props: DropdownIndicatorProps<SearchOption, true>,
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <IconContext.Provider value={{ className: 'text-gray-400' }}>
          <FaSearch />
        </IconContext.Provider>
      </components.DropdownIndicator>
    );
  };

  const renderSermonOption = (option: SermonOption) => {
    return (
      <Link to={`/sermons/${option.value}`} reloadDocument={true}>
        <div className="px-3 py-2 hover:bg-blue-100">
          <div className="text-sm font-semibold text-si-slate">
            {option.title}
          </div>
          <div className="text-xs text-gray-500">by {option.speaker}</div>
        </div>
      </Link>
    );
  };

  const renderBibleOption = (option: BibleOption) => {
    return (
      <Link
        to={`/bible/parallel/${option.book}/${option.chapter}/${option.verse}`}
        reloadDocument={true}
      >
        <div className="px-3 py-2 hover:bg-blue-100">
          <div className="text-sm font-semibold text-si-slate">
            {option.text}
          </div>
          <div className="text-xs text-gray-500">
            {OsisToBookName[option.book as keyof typeof OsisToBookName]}{' '}
            {option.chapter}:{option.verse}
          </div>
        </div>
      </Link>
    );
  };

  const Option = (props: OptionProps<SearchOption>) => {
    if (props.data instanceof SermonOption) {
      return renderSermonOption(props.data);
    } else if (props.data instanceof BibleOption) {
      return renderBibleOption(props.data);
    } else {
      return <div>{props.children}</div>;
    }
  };

  return (
    <AsyncSelect
      loadOptions={loadOptions}
      placeholder="Search SermonIndex..."
      noOptionsMessage={() => null}
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator,
        Option,
        Menu,
        MenuList,
      }}
    />
  );
};
