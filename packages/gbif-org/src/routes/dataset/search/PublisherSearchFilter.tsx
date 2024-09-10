import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircleOutline,
  MdInfo,
  MdInfoOutline,
  MdShuffle,
} from 'react-icons/md';
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

export function PublisherSearchFilter({
  className,
  filterBeforeChanges,
  searchConfig,
}: {
  className?: string;
  filterBeforeChanges: FilterType;
  searchConfig: FilterConfigType;
}) {
  const currentFilterContext = useContext(FilterContext);
  const [showAbout, setShowAbout] = useState(false);
  const { filter, toggle, add, remove, setFullField, negateField, filterHash } =
    currentFilterContext;
  const [publishers, setPublishers] = useState<string[]>([]);
  const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const {
    data: facetData,
    error: facetError,
    loading: facetLoading,
    load: facetLoad,
  } = useQuery<DatasetPublisherFacetQuery, DatasetPublisherFacetQueryVariables>(FACET, {
    lazyLoad: true,
  });

  useEffect(() => {
    // if the filter has changed, then get facet values from API
    const v1Filter = filter2v1(filterBeforeChanges, searchConfig);
    delete v1Filter?.filter?.publishingOrg;
    facetLoad({ variables: v1Filter });
  }, [filterBeforeHash]);

  useEffect(() => {
    const prunedFilter = cleanUpFilter(cloneDeep(filterBeforeChanges));
    delete prunedFilter.must?.publishingOrg;
    setFilterBeforeHash(hash(prunedFilter));
  }, [filterBeforeChanges]);

  useEffect(() => {
    const publishers = filter?.must?.publishingOrg ?? [];
    setPublishers(publishers);
  }, [filterHash]);

  const search = useCallback((q: string) => {
    // fetch data from https://api.gbif.org/v1/organization/suggest?limit=8&q=${q} and store it in results
    fetch(`https://api.gbif.org/v1/organization/suggest?limit=20&q=${q}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      });
  }, []);

  const suggestions = facetData?.search?.facet?.field?.filter((x) => !publishers.includes(x.name))

  return (
    <div>
      <div className="g-flex">
        <ComboBoxExample onSelect={item => add('publishingOrg', item.key)}/>
        {/* <SearchInput placeholder="Search" className="g-border-primary-500 g-flex-auto" /> */}
        {/* <button className="g-text-slate-700 g-ps-2"><MdInfoOutline /></button> */}
        {/* <OrganizationSearchSugget setSelected={x => add('publishingOrg', x.key)} open={true} className="g-w-full"/> */}
      </div>
      <div className="g-flex g-text-sm g-text-slate-400 g-mt-1">
        <div className="g-flex-auto">{publishers?.length} selected</div>
        <div className="g-flex-none g-text-base">
          {publishers.length > 0 && (
            <button className="g-mx-1" onClick={() => setFullField('publishingOrg', [], [])}>
              <MdDeleteOutline />
            </button>
          )}
          {/* <button className="g-mx-1" onClick={() => negateField('publishingOrg', true)}>
            <MdOutlineRemoveCircle />
            <MdOutlineRemoveCircleOutline />
          </button> */}
          {/* <button className="g-mx-1">
            <MdShuffle />
          </button> */}
          <button className="g-mx-1" onClick={() => setShowAbout(!showAbout)}>
            {!showAbout && <MdInfoOutline />}
            {showAbout && <MdInfo />}
          </button>
        </div>
      </div>
      {showAbout && (
        <div className="g-bg-slate-200 g-p-2 g-text-sm g-rounded g-mb-2">Help text goes here</div>
      )}
      <div className="g-text-base">
        <fieldset className="g-text-sm">
          {publishers.map((x) => {
            return (
              <Option
                key={x}
                className="g-mb-1"
                onClick={() => toggle('publishingOrg', x)}
                checked={true}
                // helpText="Longer description can go here"
              >
                <PublisherLabel id={x} />
              </Option>
            );
          })}
        </fieldset>
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className={`${publishers?.length > 0 ? 'g-border-t' : ''} g-mt-2 g-pt-1`}>
          <h4 className="g-text-sm g-text-slate-400 g-mb-1">Suggestions</h4>
          <fieldset className="g-text-sm g-text-slate-600">
            {suggestions.map((x) => {
                return (
                  <Option
                    key={x.name}
                    className="g-mb-1"
                    onClick={() => {
                      toggle('publishingOrg', x.name);
                    }}
                    // checked={false}
                    // helpText={`Datasets: ${x.count}`}
                  >
                    {x?.item?.title ?? x.name}
                  </Option>
                );
              })}
          </fieldset>
        </div>
      )}
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
    <label className={cn('g-flex', className)}>
      <Checkbox
        className="g-flex-none g-me-2 g-mt-1"
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
