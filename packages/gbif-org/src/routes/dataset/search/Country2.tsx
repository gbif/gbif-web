import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from '@radix-ui/react-icons';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  MdDeleteOutline,
  MdInfoOutline,
  MdOutlineRemoveCircleOutline,
  MdShuffle,
} from 'react-icons/md';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { PiEmptyBold } from 'react-icons/pi';
import { HelpLine } from '@/components/helpText';
import { useEffect, useState } from 'react';
import { Option } from './CountrySearchFilter';
import { FormattedNumber } from 'react-intl';
import { CountryLabel, PublisherLabel } from './DisplayName';

export function Country2() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // fetch data from https://api.gbif.org/v1/organization/suggest?limit=8&q=${query} and store it in results
    fetch(`https://api.gbif.org/v1/organization/suggest?limit=20&q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      });
  }, [query]);

  console.log(results);
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]" shouldFilter={false}>
      <CommandInput
        placeholder="Type a command or search..."
        value={query}
        onValueChange={setQuery}
        onBlur={() => setQuery('')}
        onKeyDown={(e) => {
          // if ESC then set query to ''
          if (e.key === 'Escape') {
            setQuery('');
          }
        }}
      />
      {query !== 'sdlfkjh' && (
        <div className="g-overflow-hidden g-p-1 g-px-3 g-py-1.5 g-text-xs g-font-medium g-text-muted-foreground">
          <div className="g-flex">
            <div className="g-flex-none g-text-xs g-font-bold">12 selected</div>
            <div className="g-flex-auto"></div>
            <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
              <button className="g-mx-1 g-me-2 g-px-1 g-pe-3 g-border-r">
                <MdDeleteOutline />
              </button>
              <SimpleTooltip delayDuration={300} title="Exclude selected">
                <button className="g-px-1">
                  <MdOutlineRemoveCircleOutline />
                </button>
              </SimpleTooltip>
              <SimpleTooltip delayDuration={300} title="Invert selection">
                <button className="g-px-1">
                  <MdShuffle />
                </button>
              </SimpleTooltip>
              <SimpleTooltip delayDuration={300} title="Filter by existence">
                <button className="g-px-1">
                  <PiEmptyBold />
                </button>
              </SimpleTooltip>

              <SimpleTooltip delayDuration={300} title="About this filter">
                <HelpLine
                  id="how-to-link-datasets-to-my-project-page"
                  title={<MdInfoOutline className="g-mx-1" />}
                />
              </SimpleTooltip>
            </div>
          </div>
        </div>
      )}
      <CommandList
        className="[&::-webkit-scrollbar]:g-w-1
                  [&::-webkit-scrollbar-track]:g-bg-gray-100
                  [&::-webkit-scrollbar-thumb]:g-bg-gray-300"
      >
        <CommandEmpty>No results found.</CommandEmpty>
        {query === '' && (
          <CommandGroup>
            <CommandItem>
              <Option
                helpText="Longer description can go here"
                className="g-mb-2"
                checked={true}
                // helpText="Longer description can go here"
              >
                <div className="g-flex g-items-center">
                  <span className="g-flex-auto">
                    <PublisherLabel id={'f4ce3c03-7b38-445e-86e6-5f6b04b649d4'} />
                  </span>
                  <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                    <FormattedNumber value={123} />
                  </span>
                </div>
              </Option>
            </CommandItem>
          </CommandGroup>
        )}
        <CommandSeparator />
        <CommandGroup heading="Suggestions">
          {results.map((item) => (
            <CommandItem key={item.key} value={item.key}>
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
