import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircleOutline,
  MdInfo,
  MdInfoOutline,
  MdShuffle,
  MdPieChart,
  MdPieChartOutline,
} from 'react-icons/md';
import { PiEmptyBold, PiEmptyFill } from 'react-icons/pi';
import { TiArrowShuffle as InvertIcon } from 'react-icons/ti';
import { cn } from '@/utils/shadcn';
import { Checkbox } from '@/components/ui/checkbox';
import { cleanUpFilter, FilterContext, FilterContextType, FilterType } from '@/contexts/filter';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import useQuery from '@/hooks/useQuery';
import {
  DatasetPublisherFacetQuery,
  DatasetPublisherFacetQueryVariables,
  OccurrenceTypeFacetQuery,
  OccurrenceTypeFacetQueryVariables,
} from '@/gql/graphql';
import { PublisherLabel, TypeStatusLabel } from './DisplayName';
import hash from 'object-hash';
import cloneDeep from 'lodash/cloneDeep';
import { SearchCommand } from '@/routes/publisher/search/filters/searchSuggest';
import { OrganizationSearchSugget } from '@/components/searchSelect/organizationSearchSuggest';
import { ComboBoxExample } from './Test';
import { HelpLine, HelpText } from '@/components/helpText';
import { FormattedNumber } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
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
import { set } from 'lodash';
import types from '@/enums/basic/typeStatus.json';

export function TypeStatusFilter({
  className,
  filterBeforeChanges,
  searchConfig,
}: {
  className?: string;
  filterBeforeChanges: FilterType;
  searchConfig: FilterConfigType;
}) {
  const currentFilterContext = useContext(FilterContext);
  const { filter, toggle, add, remove, setFullField, negateField, filterHash } =
    currentFilterContext;
  const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
  const [facetLookup, setFacetLookup] = useState<Record<string, number>>({});
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  // assign a ref that we can attach to the command input field to control focus
  const inputRef = useRef<HTMLInputElement>(null);

  console.log(filter);
  // useEffect(() => {
  //   // fetch data from https://api.gbif.org/v1/organization/suggest?limit=8&q=${query} and store it in results
  //   fetch(`https://api.gbif.org/v1/organization/suggest?limit=20&q=${query}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setResults(data);
  //     });
  // }, [query]);

  const {
    data: facetData,
    error: facetError,
    loading: facetLoading,
    load: facetLoad,
  } = useQuery<OccurrenceTypeFacetQuery, OccurrenceTypeFacetQueryVariables>(FACET, {
    lazyLoad: true,
  });

  useEffect(() => {
    facetLoad();
  }, [filterBeforeHash]);

  useEffect(() => {
    // set selected basedon filter
    const selected = filter?.must?.typeStatus ?? [];
    setSelected(selected);
  }, [filterHash]);

  useEffect(() => {
    // map selectedFacetData to a lookup so that we have easy access to the counts per publisher key
    const selectedFacetLookup =
      facetData?.search?.facet?.field?.reduce((acc, x) => {
        acc[x.key] = x.count;
        return acc;
      }, {} as Record<string, number>) ?? {};
    setFacetLookup(selectedFacetLookup);
  }, [facetData]);

  return (
    <div
      onBlur={(e) => {
        // Get the element that received focus
        const newlyFocusedElement = e.relatedTarget;
        // Check if the newly focused element is outside the div
        if (!newlyFocusedElement || !e.currentTarget.contains(newlyFocusedElement)) {
          setQuery('');
        }
      }}
    >
      <Command className="rounded-lg border shadow-md md:min-w-[450px]" shouldFilter={true}>
        <CommandInput
          ref={inputRef}
          placeholder="Type a command or search..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            // if ESC then set query to ''
            if (e.key === 'Escape') {
              setQuery('');
              // scroll CommandList to top
              const commandList = document.querySelector('.commandList-gbif');
              if (commandList) {
                commandList.scrollTo(0, 0);
              }
            }
          }}
        />
        <CommandList
          className="commandList-gbif g-max-h-96 g-py-1
                  [&::-webkit-scrollbar]:g-w-1
                  [&::-webkit-scrollbar-track]:g-bg-gray-100
                  [&::-webkit-scrollbar-thumb]:g-bg-gray-300"
        >
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {types.map((type) => (
              <CommandItem
                key={type}
                value={type}
                onSelect={() => {
                  toggle('typeStatus', type);
                }}
              >
                <Option
                  tabIndex={-1}
                  key={type}
                  className="g-w-full"
                  onClick={() => {
                    toggle('typeStatus', type);
                  }}
                  checked={selected.includes(type)}
                >
                  <div className="g-flex g-items-start g-w-full">
                    <span className="g-flex-auto">
                      <TypeStatusLabel id={type} />
                    </span>
                    <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1 g-mt-0.5">
                      <FormattedNumber value={facetLookup[type] ?? 0} />
                    </span>
                  </div>
                </Option>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <div
        className="g-flex g-text-sm g-text-slate-400 g-py-1.5 g-items-center g-border-t g-px-4"
        onFocus={(e) => setQuery('')}
        onClick={(e) => setQuery('')}
      >
        <div className="g-flex-none g-text-xs g-font-bold">{selected.length} selected</div>
        <div className="g-flex-auto"></div>
        <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
          {selected.length > 0 && (
            <button
              className="g-mx-1 g-me-2 g-px-1 g-pe-3 g-border-r"
              onClick={() => setFullField('typeStatus', [], [])}
            >
              <MdDeleteOutline />
            </button>
          )}
          <div className="g-inline">
            {/* <SimpleTooltip delayDuration={300} title="Exclude selected">
                  <span className="g-px-1" onClick={() => negateField('typeStatus', true)}>
                    <MdOutlineRemoveCircleOutline />
                  </span>
                </SimpleTooltip> */}
            <SimpleTooltip delayDuration={300} title="Invert selection">
              <button
                className="g-px-1"
                onClick={() => {
                  // reverse teh selection
                  const newSelected = types.filter((x) => !selected.includes(x));
                  setFullField('typeStatus', newSelected, []);
                }}
              >
                <MdShuffle />
              </button>
            </SimpleTooltip>
            <SimpleTooltip delayDuration={300} title="Filter by existence">
              <button className="g-px-1">
                <PiEmptyBold />
              </button>
            </SimpleTooltip>

            <HelpLine
              id="how-to-link-datasets-to-my-project-page"
              title={<MdInfoOutline className="g-mx-1" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Option({
  className,
  helpText,
  checked,
  onClick,
  children,
  tabIndex,
}: {
  helpText?: string;
  checked?: boolean;
  children: React.ReactNode;
  onClick: (checked: boolean) => void;
  className?: string;
  tabIndex: number;
}) {
  // const Icon = checked ? MdOutlineRemoveCircle : MdOutlineAddCircle;
  return (
    <label className={cn('g-flex', className)} tabIndex={tabIndex}>
      <Checkbox
        tabIndex={tabIndex}
        className="g-flex-none g-me-2 g-mt-0.5"
        checked={checked}
        onClick={() => {
          onClick(!checked);
        }}
      />
      {/* <MdAddCircleOutline className="g-flex-none g-me-2 g-mt-1" /> */}
      {/* <Icon className="g-flex-none g-me-2 g-mt-1 g-text-primary-500" /> */}
      <div className="g-flex-auto">
        <div className="">{children}</div>
        {helpText && <div className="g-text-slate-400 g-text-sm">{helpText}</div>}
      </div>
    </label>
  );
}

const FACET = /* GraphQL */ `
  query OccurrenceTypeFacet {
    search: occurrenceSearch {
      facet {
        field: typeStatus {
          key
          count
        }
      }
    }
  }
`;
