import { Link } from '@remix-run/react';
import { IconContext } from 'react-icons';
import { FaSearch } from 'react-icons/fa';
import { DropdownIndicatorProps, OptionProps, components } from 'react-select';
import AsyncSelect from 'react-select/async';
import { ListResponse, Sermon } from '~/api/interfaces';
import { fetchApi } from '~/api/sdk';

type SermonOption = {
  value: number;
  title: string;
  speaker: string;
};

export const SermonSearch = () => {
  const loadSermons = (
    inputValue: string,
    callback: (options: SermonOption[]) => void,
  ) => {
    if (!inputValue || inputValue.length < 4) return;

    fetchApi<ListResponse<Sermon>>(`/sermons/search?title=${inputValue}`).then(
      (sermons) => {
        if ('statusCode' in sermons) return ['Failed to search for sermons'];
        if (sermons.values.length === 0) return ['No sermons found'];

        callback(
          sermons.values.map((sermon) => {
            return {
              value: sermon.id,
              title: sermon.title,
              speaker: sermon.contributorFullName,
            };
          }),
        );
      },
    );
  };

  const DropdownIndicator = (
    props: DropdownIndicatorProps<SermonOption, true>,
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <IconContext.Provider
          value={{ className: 'text-gray-400 hover:text-gray-400' }}
        >
          <FaSearch />
        </IconContext.Provider>
      </components.DropdownIndicator>
    );
  };

  const Option = (props: OptionProps<SermonOption>) => {
    return (
      <Link to={`/sermons/${props.data.value}`}>
        <div className="px-3 py-2 hover:bg-blue-100">
          <div className="text-sm font-semibold">{props.data.title}</div>
          <div className="text-xs text-gray-500">by {props.data.speaker}</div>
        </div>
      </Link>
    );
  };

  return (
    <AsyncSelect
      loadOptions={loadSermons}
      placeholder="Search Sermons..."
      noOptionsMessage={() => null}
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator,
        Option,
      }}
    />
  );
};
