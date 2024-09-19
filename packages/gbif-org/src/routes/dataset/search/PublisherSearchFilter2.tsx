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
import { DatasetPublisherFacetQuery, DatasetPublisherFacetQueryVariables } from '@/gql/graphql';
import { PublisherLabel } from './DisplayName';
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

export function PublisherSearchFilter2({
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
  const [publishers, setPublishers] = useState<string[]>([]);
  const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
  const [facetLookup, setFacetLookup] = useState<Record<string, number>>({});
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  // assign a ref that we can attach to the command input field to control focus
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // fetch data from https://api.gbif.org/v1/organization/suggest?limit=8&q=${query} and store it in results
    fetch(`https://api.gbif.org/v1/organization/suggest?limit=20&q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      });
  }, [query]);

  const {
    data: facetData,
    error: facetError,
    loading: facetLoading,
    load: facetLoad,
  } = useQuery<DatasetPublisherFacetQuery, DatasetPublisherFacetQueryVariables>(FACET, {
    lazyLoad: true,
  });

  const {
    data: selectedFacetData,
    error: selectedFacetError,
    loading: selectedFacetLoading,
    load: selectedFacetLoad,
  } = useQuery<DatasetPublisherFacetQuery, DatasetPublisherFacetQueryVariables>(FACET, {
    lazyLoad: true,
  });

  useEffect(() => {
    // if the filter has changed, then get facet values from API
    const v1Filter = filter2v1(filterBeforeChanges, searchConfig);
    delete v1Filter?.filter?.publishingOrg;
    facetLoad({ variables: v1Filter?.filter });
  }, [filterBeforeHash]);

  useEffect(() => {
    // if the filter has changed, then get facet values from API
    const v1Filter = filter2v1(filter, searchConfig);
    selectedFacetLoad({ variables: v1Filter?.filter });
  }, [filterHash]);

  useEffect(() => {
    const prunedFilter = cleanUpFilter(cloneDeep(filterBeforeChanges));
    delete prunedFilter.must?.publishingOrg;
    setFilterBeforeHash(hash(prunedFilter));
  }, [filterBeforeChanges]);

  useEffect(() => {
    const publishers = filter?.must?.publishingOrg ?? [];
    setPublishers(publishers);
  }, [filterHash]);

  useEffect(() => {
    // map selectedFacetData to a lookup so that we have easy access to the counts per publisher key
    const selectedFacetLookup =
      selectedFacetData?.search?.facet?.field?.reduce((acc, x) => {
        acc[x.name] = x.count;
        return acc;
      }, {} as Record<string, number>) ?? {};
    setFacetLookup(selectedFacetLookup);
  }, [selectedFacetData]);

  const suggestions = facetData?.search?.facet?.field?.filter((x) => !publishers.includes(x.name));

  // const search = useCallback((q: string) => {
  //   // fetch data from https://api.gbif.org/v1/organization/suggest?limit=8&q=${q} and store it in results
  //   fetch(`https://api.gbif.org/v1/organization/suggest?limit=20&q=${q}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setResults(data);
  //     });
  // }, []);

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
      <Command className="rounded-lg border shadow-md md:min-w-[450px]" shouldFilter={false}>
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
              const commandList = document.querySelector('#CommandList');
              if (commandList) {
                commandList.scrollTo(0, 0);
              }
            }
          }}
        />
        {query !== 'sdlfkjh' && (
          <div className="g-overflow-hidden g-p-1 g-px-3 g-py-1.5 g-text-xs g-font-medium g-text-muted-foreground" onFocus={(e) => setQuery('')} onClick={(e) => setQuery('')}>
            <div className="g-flex">
              <div className="g-flex-none g-text-xs">{publishers.length} selected</div>
              <div className="g-flex-auto"></div>
              <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
                {publishers.length > 0 && (
                  <button
                    className="g-mx-1 g-me-2 g-px-1 g-pe-3 g-border-r"
                    onClick={() => setFullField('publishingOrg', [], [])}
                  >
                    <MdDeleteOutline />
                  </button>
                )}
                <div className="g-inline">
                  <SimpleTooltip delayDuration={300} title="Exclude selected">
                    <button className="g-px-1" onClick={() => negateField('publishingOrg', true)}>
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
          </div>
        )}
        <CommandList id="CommandList"
          className="[&::-webkit-scrollbar]:g-w-1
                  [&::-webkit-scrollbar-track]:g-bg-gray-100
                  [&::-webkit-scrollbar-thumb]:g-bg-gray-300"
        >
          <CommandEmpty>No results found.</CommandEmpty>
          {query === '' && publishers.length > 0 && (
            <CommandGroup>
              {publishers.map((x) => {
                return (
                  <CommandItem key={x}>
                    <Option
                      // helpText="Longer description can go here"
                      className="g-w-full"
                      checked={true}
                      onClick={() => remove('publishingOrg', x)}
                      // helpText="Longer description can go here"
                    >
                      <div className="g-flex g-items-start">
                        <span className="g-flex-auto">
                          <PublisherLabel id={x} />
                        </span>
                        <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                          <FormattedNumber value={facetLookup[x] ?? 0} />
                        </span>
                      </div>
                    </Option>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
          <CommandSeparator />
          {query === '' && suggestions && suggestions.length > 0 && (
          <CommandGroup heading="Top results">
            {suggestions.map((x) => (
              <CommandItem key={x.name} value={x.name} onSelect={() => {
                toggle('publishingOrg', x.name);
              }}>
                <Option
                  key={x.name}
                  className="g-w-full"
                  onClick={() => {
                    toggle('publishingOrg', x.name);
                  }}
                  // checked={false}
                  // helpText={`Datasets: ${x.count}`}
                >
                  <div className="g-flex g-w-full g-items-start">
                    <span className="g-flex-auto">{x?.item?.title ?? x.name}</span>
                    <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                      <FormattedNumber value={x.count} />
                    </span>
                  </div>
                </Option>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
          {query !== '' && results.length > 0 && (
          <CommandGroup heading={`Results for "${query}"`}>
            {results.map((x) => (
              <CommandItem
                key={x.key}
                value={x.key}
                onSelect={() => {
                  add('publishingOrg', x.key);
                  // setQuery('');
                }}
              >
                {/* {x?.title ?? x.key} test */}
                <Option
                  key={x.key}
                  className=""
                  onClick={() => {
                    add('publishingOrg', x.key);
                    // setQuery('');
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  checked={publishers.includes(x.key)}
                  // helpText={`Datasets: ${x.count}`}
                >
                  <div className="g-flex g-items-center">
                    <span className="g-flex-auto">{x?.title}</span>
                  </div>
                </Option>
              </CommandItem>
            ))}
          </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>

    // <div className="">
    //   <div className="g-flex">
    //     <ComboBoxExample
    //       onSelect={(item) => add('publishingOrg', item.key)}
    //       className="g-border-slate-100 g-border-b-2 g-py-1.5 g-px-4"
    //     />
    //     {/* <SearchInput placeholder="Search" className="g-border-primary-500 g-flex-auto" /> */}
    //     {/* <button className="g-text-slate-700 g-ps-2"><MdInfoOutline /></button> */}
    //     {/* <OrganizationSearchSugget setSelected={x => add('publishingOrg', x.key)} open={true} className="g-w-full"/> */}
    //   </div>
    //   <div
    //     className={cn('g-flex g-text-sm g-text-slate-400 g-mt-1 g-pb-1 g-items-center', className)}
    //   >
    //     {publishers.length > -1 && (
    //       <div className="g-flex-none g-text-xs g-font-bold">{publishers?.length} selected</div>
    //     )}
    //     {options}
    //   </div>
    //   <>
    //     {publishers.length > 0 && (
    //       <div className={cn('g-text-base g-mt-2', className)}>
    //         <fieldset className="g-text-sm">
    //           {publishers.map((x) => {
    //             return (
    //               <Option
    //                 key={x}
    //                 className="g-mb-2"
    //                 onClick={() => toggle('publishingOrg', x)}
    //                 checked={true}
    //                 // helpText="Longer description can go here"
    //               >
    //                 <div className="g-flex g-items-center">
    //                   <span className="g-flex-auto"><PublisherLabel id={x} /></span>
    //                   <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
    //                     <FormattedNumber value={facetLookup[x] ?? 0} />
    //                   </span>
    //                 </div>
    //               </Option>
    //             );
    //           })}
    //         </fieldset>
    //       </div>
    //     )}
    //     {suggestions && suggestions.length > 0 && (
    //       <div className={cn(`g-p-2 g-pt-2 `, publishers.length > 0 && 'g-border-t', className)}>
    //         {/* <div className={cn('g-flex g-text-sm g-text-slate-400 g-mt-1 g-mb-2 g-items-center')}>
    //           <h4 className="g-text-xs g-font-bold g-text-slate-400 g-mb-1">Suggestions</h4>
    //         </div> */}
    //         <fieldset className="g-text-sm g-text-slate-600">
    //           {suggestions.map((x) => {
    //             return (
    // <Option
    //   key={x.name}
    //   className="g-mb-2"
    //   onClick={() => {
    //     toggle('publishingOrg', x.name);
    //   }}
    //   // checked={false}
    //   // helpText={`Datasets: ${x.count}`}
    // >
    //   <div className="g-flex g-items-center">
    //     <span className="g-flex-auto">{x?.item?.title ?? x.name}</span>
    //     <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
    //       <FormattedNumber value={x.count} />
    //     </span>
    //   </div>
    // </Option>
    //             );
    //           })}
    //         </fieldset>
    //       </div>
    //     )}
    //   </>
    // </div>
  );
}

export function Option({
  className,
  helpText,
  checked,
  onClick,
  children,
}: {
  helpText?: string;
  checked?: boolean;
  children: React.ReactNode;
  onClick: (checked: boolean) => void;
  className?: string;
}) {
  // const Icon = checked ? MdOutlineRemoveCircle : MdOutlineAddCircle;
  return (
    <label className={cn('g-flex', className)}>
      <Checkbox
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
  query DatasetPublisherFacet(
    $license: [License]
    $endorsingNodeKey: [ID]
    $networkKey: [ID]
    $publishingOrg: [ID]
    $hostingOrg: [ID]
    $publishingCountry: [Country]
    $q: String
    $offset: Int
    $limit: Int
    $type: [DatasetType]
    $subtype: [DatasetSubtype]
  ) {
    search: datasetSearch(
      license: $license
      endorsingNodeKey: $endorsingNodeKey
      networkKey: $networkKey
      publishingOrg: $publishingOrg
      hostingOrg: $hostingOrg
      publishingCountry: $publishingCountry
      q: $q
      limit: $limit
      offset: $offset
      type: $type
      subtype: $subtype
    ) {
      facet {
        field: publishingOrg {
          name
          count
          item: organization {
            title
          }
        }
      }
    }
  }
`;
