import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { useContext, useEffect, useRef, useState } from 'react';
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
import { FilterContext, FilterContextType, FilterType } from '@/contexts/filter';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import useQuery from '@/hooks/useQuery';
import { DatasetPublisherFacetQuery, DatasetPublisherFacetQueryVariables } from '@/gql/graphql';

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
  const [isInputHidden, setIsInputHidden] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { filter, toggle, add, remove, setFullField, negateField, filterHash } = currentFilterContext;
  const [publishers, setPublishers] = useState<string[]>([]);

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
  }, [filterBeforeChanges]);

  useEffect(() => {
    const publishers = filter?.must?.publishingOrg ?? [];
    setPublishers(publishers);
  }, [filterHash]);

  return (
    <div>
      <div className="g-flex">
        <SearchInput placeholder="Search" className="g-border-primary-500 g-flex-auto" />
        {/* <button className="g-text-slate-700 g-ps-2"><MdInfoOutline /></button> */}
      </div>
      <div className="g-flex g-text-sm g-text-slate-400 g-mt-1">
        <div className="g-flex-auto">{publishers?.length} selected</div>
        <div className="g-flex-none g-text-base">
          {publishers.length > 0 && <button className="g-mx-1" onClick={() => setFullField('publishingOrg', [], [])}>
            <MdDeleteOutline />
          </button>}
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
        <fieldset>
          {publishers.map((x) => {
            return (
              <Option
                key={x}
                className="g-mb-1"
                onClick={() => toggle('publishingOrg', x)}
                checked={true}
                helpText="Longer description can go here"
              >
                {x}
              </Option>
            );
          })}
        </fieldset>
      </div>
      <div className="g-border-t g-mt-2 g-pt-1">
        <h4 className="g-text-sm g-text-slate-400 g-mb-1">Suggestions</h4>
        {facetData?.search?.facet?.field?.length && facetData?.search?.facet?.field?.length > 0 && (
          <fieldset>
            {facetData?.search?.facet?.field?.map((x) => {
              return (
                <Option
                  key={x.name}
                  className="g-mb-1"
                  onClick={() => {
                    toggle('publishingOrg', x.name)
                  }}
                  // checked={false}
                  helpText={`Datasets: ${x.count}`}
                >
                  {x?.item?.title ?? x.name}
                </Option>
              );
            })}
          </fieldset>
        )}
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
          onClick(!checked)}
        }
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
