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
import { DatasetCountryFacetQuery, DatasetCountryFacetQueryVariables, DatasetPublisherFacetQuery, DatasetPublisherFacetQueryVariables } from '@/gql/graphql';
import { CountryLabel } from './DisplayName';
import hash from 'object-hash';
import cloneDeep from 'lodash/cloneDeep';
import { SearchCommand } from '@/routes/publisher/search/filters/searchSuggest';
import { OrganizationSearchSugget } from '@/components/searchSelect/organizationSearchSuggest';
import { ComboBoxExample } from './suggest';
import { HelpLine, HelpText } from '@/components/helpText';
import { FormattedNumber, useIntl } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
import country from '@/enums/basic/country.json';

export function CountrySearchFilter({
  className,
  filterBeforeChanges,
  searchConfig,
}: {
  className?: string;
  filterBeforeChanges: FilterType;
  searchConfig: FilterConfigType;
}) {
  const { formatMessage } = useIntl();
  const currentFilterContext = useContext(FilterContext);
  const { filter, toggle, add, remove, setFullField, negateField, filterHash } =
    currentFilterContext;
  const [publishers, setPublishers] = useState<string[]>([]);
  const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<string[]>([]);
  const [facetLookup, setFacetLookup] = useState<Record<string, number>>({});
  const [countries, setCountries] = useState<any[]>([]);

  const {
    data: facetData,
    error: facetError,
    loading: facetLoading,
    load: facetLoad,
  } = useQuery<DatasetCountryFacetQuery, DatasetCountryFacetQueryVariables>(FACET, {
    lazyLoad: true,
  });

  const {
    data: selectedFacetData,
    error: selectedFacetError,
    loading: selectedFacetLoading,
    load: selectedFacetLoad,
  } = useQuery<DatasetCountryFacetQuery, DatasetCountryFacetQueryVariables>(FACET, {
    lazyLoad: true,
  });

  useEffect(() => {
    // if the filter has changed, then get facet values from API
    const v1Filter = filter2v1(filterBeforeChanges, searchConfig);
    delete v1Filter?.filter?.publishingCountry;
    facetLoad({ variables: v1Filter?.filter });
  }, [filterBeforeHash]);

  useEffect(() => {
    // if the filter has changed, then get facet values from API
    const v1Filter = filter2v1(filter, searchConfig);
    selectedFacetLoad({ variables: v1Filter?.filter });
  }, [filterHash]);

  useEffect(() => {
    const prunedFilter = cleanUpFilter(cloneDeep(filterBeforeChanges));
    delete prunedFilter.must?.publishingCountry;
    setFilterBeforeHash(hash(prunedFilter));
  }, [filterBeforeChanges]);

  useEffect(() => {
    const publishers = filter?.must?.publishingCountry ?? [];
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

  useEffect(() => {
    // translate all country values using the intl lib
    const countryValues = country.map((code) => ({
      code,
      title: formatMessage({ id: `enums.countryCode.${code}` }),
    }));
    setCountries(countryValues);
  }, []);

  const search = useCallback(
    (q: string) => {
      // filter countries based on the search query and store it in results
      const filtered = countries.filter((x) => x?.title?.toLowerCase().includes(q.toLowerCase()));
      setResults(filtered);
    },
    [countries]
  );

  const suggestions = facetData?.search?.facet?.field?.filter((x) => !publishers.includes(x.name));

  const options = (
    <>
      <div className="g-flex-auto"></div>
      <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
        {publishers.length > 0 && (
          <button
            className="g-mx-1 g-me-2 g-px-1 g-pe-3 g-border-r"
            onClick={() => setFullField('publishingCountry', [], [])}
          >
            <MdDeleteOutline />
          </button>
        )}
        <SimpleTooltip delayDuration={300} title="Exclude selected">
          <button className="g-px-1" onClick={() => negateField('publishingCountry', true)}>
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
    </>
  );

  console.log(results);

  return (
    <div className="">
      <div
        className={cn('g-flex g-text-sm g-text-slate-400 g-mt-1 g-pb-1 g-items-center', className)}
      >
        {publishers.length > -1 && (
          <div className="g-flex-none g-text-xs g-font-bold">{publishers?.length} selected</div>
        )}
        {options}
      </div>
      <>
        {publishers.length > 0 && (
          <div className={cn('g-text-base g-mt-2', className)}>
            <fieldset className="g-text-sm">
              {publishers.map((x) => {
                return (
                  <Option
                    key={x}
                    className="g-mb-2"
                    onClick={() => toggle('publishingCountry', x)}
                    checked={true}
                    // helpText="Longer description can go here"
                  >
                    <div className="g-flex g-items-center">
                      <span className="g-flex-auto">
                        <CountryLabel id={x} />
                      </span>
                      <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                        <FormattedNumber value={facetLookup[x] ?? 0} />
                      </span>
                    </div>
                  </Option>
                );
              })}
            </fieldset>
          </div>
        )}
        <div className="g-flex">
          <SearchInput
            placeholder="Search"
            className="g-py-2 g-px-4 g-flex-auto g-border-t"
            onChange={(e) => search(e.target.value)}
          />
        </div>
        {results && results.length > 0 && (
          <div
            className={cn(
              `g-p-2 g-pt-2 g-max-h-64 g-overflow-auto`,
              results.length > 0 && 'g-border-t',
              className
            )}
          >
            {/* <div className={cn('g-flex g-text-sm g-text-slate-400 g-mt-1 g-mb-2 g-items-center')}>
              <h4 className="g-text-xs g-font-bold g-text-slate-400 g-mb-1">Suggestions</h4>
            </div> */}
            <fieldset className="g-text-sm g-text-slate-600">
              {results.filter(x => {
                // exclude already selected items
                return !publishers.includes(x.code);
              }).map((x) => {
                return (
                  <Option
                    key={x.code}
                    className="g-mb-2"
                    onClick={() => {
                      toggle('publishingCountry', x.code);
                    }}
                    checked={false}
                    // helpText={`Datasets: ${x.count}`}
                  >
                    <div className="g-flex g-items-center">
                      <span className="g-flex-auto">{x?.title ?? x.code}</span>
                      {/* <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                        <FormattedNumber value={x.count} />
                      </span> */}
                    </div>
                  </Option>
                );
              })}
            </fieldset>
          </div>
        )}
      </>
    </div>
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
    <label className={cn('g-flex g-w-full', className)}>
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
  query DatasetCountryFacet(
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
        field: publishingCountry {
          name
          count
        }
      }
    }
  }
`;
