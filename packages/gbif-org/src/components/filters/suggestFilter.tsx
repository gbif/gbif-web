import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import React, { useContext, useEffect, useState } from 'react';
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
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import useQuery from '@/hooks/useQuery';
import hash from 'object-hash';
import cloneDeep from 'lodash/cloneDeep';
import { Suggest, SuggestFnType } from './suggest';
import { HelpLine, HelpText } from '@/components/helpText';
import { FormattedNumber } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Option, SkeletonOption } from './option';
import { FacetQuery, getAsQuery } from './filterTools';
import { useSearchContext } from '@/contexts/search';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { AboutButton } from './aboutButton';

type SuggestProps = {
  className?: string;
  searchConfig: FilterConfigType;
  filterHandle: string;
  DisplayName: React.FC<{ id: string }>;
  facetQuery?: string;
  getSuggestions?: SuggestFnType;
  onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
  onCancel?: () => void;
  pristine?: boolean;
  disableFacetsForSelected: boolean;
  about: React.FC;
};

export const SuggestFilter = React.forwardRef<HTMLInputElement, SuggestProps>(
  (
    {
      className,
      searchConfig,
      filterHandle,
      DisplayName,
      facetQuery,
      getSuggestions, // function that takes a query string and returns a promise of suggestions
      onApply,
      onCancel,
      pristine,
      disableFacetsForSelected,
      about,
    }: SuggestProps,
    ref
  ) => {
    const searchContext = useSearchContext();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, setFullField, filterHash } = currentFilterContext;
    const [selected, setSelected] = useState<string[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [facetLookup, setFacetLookup] = useState<Record<string, number>>({});
    const [q, setQ] = useState<string>('');

    const About = about;
    const {
      data: facetData,
      error: facetError,
      loading: facetLoading,
      load: facetLoad,
    } = useQuery<FacetQuery, unknown>(facetQuery ?? '', {
      lazyLoad: true,
    });

    const {
      data: selectedFacetData,
      error: selectedFacetError,
      loading: selectedFacetLoading,
      load: selectedFacetLoad,
    } = useQuery<FacetQuery, unknown>(facetQuery ?? '', {
      lazyLoad: true,
    });

    useEffect(() => {
      if (!facetQuery) return;
      // if the filter has changed, then get facet values from API
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];

      const query = getAsQuery({ filter: prunedFilter, searchContext, searchConfig });
      if (searchContext.queryType === 'V1') {
        facetLoad({ variables: { query: query } });
      } else {
        facetLoad({ variables: { predicate: query } });
      }
    }, [facetQuery, filterBeforeHash, facetLoad, searchContext, searchConfig, filterHandle]);

    useEffect(() => {
      if (!facetQuery || disableFacetsForSelected) return;
      // if the filter has changed, then get facet values from API
      const query = getAsQuery({ filter: filter, searchContext, searchConfig });
      if (searchContext.queryType === 'V1') {
        selectedFacetLoad({ variables: { query: query, limit: selected?.length ?? 10 } });
      } else {
        selectedFacetLoad({ variables: { predicate: query, size: selected?.length ?? 10 } });
      }
    }, [facetQuery, filterHash, selectedFacetLoad, selected, searchContext, searchConfig]);

    useEffect(() => {
      // filter has changed updateed the listed of selected values
      const selectedList = filter?.must?.[filterHandle] ?? [];
      setSelected(selectedList);

      // secondly keep track the facets without the current filter
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      setFilterBeforeHash(hash(prunedFilter));
    }, [filterHash, filterHandle]);

    useEffect(() => {
      // map selectedFacetData to a lookup so that we have easy access to the counts per publisher key
      const selectedFacetLookup =
        selectedFacetData?.search?.facet?.field?.reduce((acc, x) => {
          acc[x.name] = x.count;
          return acc;
        }, {} as Record<string, number>) ?? {};
      setFacetLookup(selectedFacetLookup);
    }, [selectedFacetData]);

    const facetSuggestions = facetData?.search?.facet?.field?.filter(
      (x) => !selected.includes(x.name)
    );

    const options = (
      <>
        <div className="g-flex-auto"></div>
        <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
          {selected.length > 0 && (
            <button
              className={cn("g-mx-1 g-px-1", !!About && 'g-pe-3 g-border-r g-me-2')}
              onClick={() => setFullField(filterHandle, [], [])}
            >
              <MdDeleteOutline />
            </button>
          )}
          {/* <SimpleTooltip delayDuration={300} title="Exclude selected">
          <button
            className="g-px-1"
            onClick={() => {
              // negateField('publishingOrg', true)
            }}
          >
            <MdOutlineRemoveCircleOutline />
          </button>
        </SimpleTooltip> */}
          {/* <SimpleTooltip delayDuration={300} title="Invert selection">
          <button className="g-px-1">
            <MdShuffle />
          </button>
        </SimpleTooltip>
        <SimpleTooltip delayDuration={300} title="Filter by existence">
          <button className="g-px-1">
            <PiEmptyBold />
          </button>
        </SimpleTooltip> */}

          {About && (
            <AboutButton className="-g-me-1">
              <About />
            </AboutButton>
          )}
        </div>
      </>
    );

    return (
      <div className="g-flex g-flex-col">
        <div className="g-flex g-flex-none">
          <div className="g-p-2 g-w-full">
            {getSuggestions && (
              <Suggest
                ref={ref}
                onSelect={(item) => add(filterHandle, item.key)}
                className={cn(
                  'g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset',
                  className
                )}
                selected={selected}
                getSuggestions={getSuggestions}
                onKeyPress={(e) => (e.key === 'Enter' ? onApply?.() : null)}
              />
            )}
            {!getSuggestions && (
              <SearchInput
                ref={ref}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="g-w-full g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset"
                onKeyDown={(e) => {
                  // if user press enter, then update the value
                  if (e.key === 'Enter') {
                    if (e.currentTarget.value !== '') {
                      add(filterHandle, e.currentTarget.value);
                      setQ('');
                    } else {
                      onApply?.();
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
        <div
          className={cn(
            'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-1.5 g-px-4 g-items-center',
            className
          )}
        >
          {selected.length > -1 && (
            <div className="g-flex-none g-text-xs g-font-bold">{selected?.length} selected</div>
          )}
          {options}
        </div>
        <div className="g-flex-auto g-overflow-auto g-max-h-96 [&::-webkit-scrollbar]:g-w-1 [&::-webkit-scrollbar-track]:g-bg-gray-100 [&::-webkit-scrollbar-thumb]:g-bg-gray-300">
          {selected.length > 0 && (
            <div className={cn('g-text-base g-mt-2 g-px-4', className)}>
              <div role="group" className="g-text-sm">
                {selected.map((x) => {
                  return (
                    <Option
                      key={x}
                      className="g-mb-2"
                      onClick={() => {
                        toggle(filterHandle, x);
                      }}
                      onKeyDown={(e) => (e.key === 'Enter' ? onApply?.({}) : null)}
                      checked={true}
                      // helpText="Longer description can go here"
                    >
                      <div className="g-flex g-items-center">
                        <span className="g-flex-auto">
                          <DisplayName id={x} />
                        </span>
                        {!selectedFacetLoading &&
                          !selectedFacetError &&
                          !disableFacetsForSelected && (
                            <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                              <FormattedNumber value={facetLookup[x] ?? 0} />
                            </span>
                          )}
                      </div>
                    </Option>
                  );
                })}
              </div>
            </div>
          )}
          {facetSuggestions && facetSuggestions.length === 0 && selected?.length === 0 && (
            <div className="g-p-4 g-text-center g-text-sm g-text-slate-400">
              No matching records.
            </div>
          )}
          <AsyncOptions loading={facetLoading} error={facetError} className="g-p-2 g-pt-2 g-px-4">
            {facetSuggestions && facetSuggestions.length > 0 && (
              <div
                className={cn(
                  `g-p-2 g-pt-2 g-px-4`,
                  selected.length > 0 && 'g-border-t',
                  className
                )}
              >
                {/* <div className={cn('g-flex g-text-sm g-text-slate-400 g-mt-1 g-mb-2 g-items-center')}>
              <h4 className="g-text-xs g-font-bold g-text-slate-400 g-mb-1">Suggestions</h4>
            </div> */}
                <div role="group" className="g-text-sm g-text-slate-600">
                  {facetSuggestions.map((x) => {
                    return (
                      <Option
                        key={x.name}
                        className="g-mb-2"
                        onClick={() => {
                          toggle(filterHandle, x.name);
                        }}
                        onKeyDown={(e) => (e.key === 'Enter' ? onApply?.({}) : null)}
                        // checked={false}
                        // helpText={`Datasets: ${x.count}`}
                      >
                        <div className="g-flex g-items-center">
                          <span className="g-flex-auto g-overflow-hidden g-text-ellipsis g-whitespace-nowrap">
                            {x?.item?.title ?? <DisplayName id={x?.name} />}
                          </span>
                          <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                            <FormattedNumber value={x.count} />
                          </span>
                        </div>
                      </Option>
                    );
                  })}
                </div>
              </div>
            )}
          </AsyncOptions>
        </div>
        {onApply && onCancel && (
          <div className="g-flex-none g-py-2 g-px-2 g-flex g-justify-between">
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {!pristine && (
              <Button
                type="submit"
                role="button"
                size="sm"
                onClick={() => onApply({ keepOpen: false })}
              >
                Apply
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

function AsyncOptions({
  children,
  loading,
  error,
  className,
}: {
  children: React.ReactNode;
  loading: boolean;
  error?: Error;
  className?: string;
}) {
  if (error) {
    return (
      <div className="g-p-2 g-m-4 g-text-red-900 g-text-sm">Unable to load suggestions...</div>
    );
  }
  if (loading) {
    return (
      <div className={cn(className)}>
        <SkeletonOption className="g-w-full g-mb-2" />
        <SkeletonOption className="g-w-36 g-max-w-full g-mb-2" />
        <SkeletonOption className="g-max-w-full g-w-48 g-mb-2" />
        <SkeletonOption className="g-max-w-full g-w-64 g-mb-2" />
      </div>
    );
  }
  return children;
}
