import { SearchInput } from '@/components/searchInput';
import React, { useContext, useEffect, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircleOutline,
  MdOutlineRemoveCircle,
  MdArrowBack,
} from 'react-icons/md';
import { PiEmptyBold, PiEmptyFill } from 'react-icons/pi';
import { cn } from '@/utils/shadcn';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import useQuery from '@/hooks/useQuery';
import hash from 'object-hash';
import cloneDeep from 'lodash/cloneDeep';
import { Suggest } from './suggest';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Option } from './option';
import {
  AdditionalFilterProps,
  ApplyCancel,
  AsyncOptions,
  FacetQuery,
  filterSuggestConfig,
  FilterSummaryType,
  getAsQuery,
  getFilterSummary,
} from './filterTools';
import { useSearchContext } from '@/contexts/search';
import { AboutButton } from './aboutButton';
import { Exists } from './exists';
import StripeLoader from '../stripeLoader';

type SuggestProps = Omit<filterSuggestConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

export const SuggestFilter = React.forwardRef<HTMLInputElement, SuggestProps>(
  (
    {
      className,
      searchConfig,
      filterHandle,
      displayName: DisplayName,
      facetQuery,
      suggestConfig, // function that takes a query string and returns a promise of suggestions
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
    const { filter, toggle, add, setFullField, setFilter, filterHash, negateField } =
      currentFilterContext;
    const [selected, setSelected] = useState<string[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [facetLookup, setFacetLookup] = useState<Record<string, number>>({});
    const [q, setQ] = useState<string>('');
    const [backupFilter, setBackupFilter] = useState<FilterType | undefined>(undefined);
    const [filterSummary, setFilterSummary] = useState<FilterSummaryType>(
      getFilterSummary(filter, filterHandle)
    );
    const [filterType, setFilterType] = useState(
      filterSummary?.isNotNull || filterSummary?.isNull ? 'EXISTS' : 'SELECT'
    );
    const [useNegations, setUseNegations] = useState(filterSummary?.hasNegations ?? false);

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
      // delete prunedFilter.mustNot?.[filterHandle];

      const query = getAsQuery({ filter: prunedFilter, searchContext, searchConfig });
      if (searchContext.queryType === 'V1') {
        facetLoad({ variables: { query: query } });
      } else {
        facetLoad({ variables: { predicate: query }, keepDataWhileLoading: true });
      }
    }, [facetQuery, filterBeforeHash, facetLoad, searchContext, searchConfig, filterHandle]);

    useEffect(() => {
      if (
        !facetQuery ||
        disableFacetsForSelected ||
        filterSummary?.isNotNull ||
        filterSummary?.isNull ||
        filterSummary?.mixed ||
        useNegations
      )
        return;
      // if the filter has changed, then get facet values from API
      const query = getAsQuery({ filter: filter, searchContext, searchConfig });
      if (searchContext.queryType === 'V1') {
        selectedFacetLoad({ variables: { query: query, limit: selected?.length ?? 10 } });
      } else {
        selectedFacetLoad({ variables: { predicate: query, size: selected?.length ?? 10 } });
      }
    }, [
      facetQuery,
      disableFacetsForSelected,
      filterHash,
      selectedFacetLoad,
      selected,
      searchContext,
      searchConfig,
      useNegations,
    ]);

    useEffect(() => {
      // filter has changed updateed the listed of selected values
      const selectedList = filter?.must?.[filterHandle] ?? filter?.mustNot?.[filterHandle] ?? [];
      setSelected(selectedList);

      // secondly keep track the facets without the current filter
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      setFilterBeforeHash(hash(prunedFilter));

      const filterSummary = getFilterSummary(filter, filterHandle);
      setFilterSummary(filterSummary);
      // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterHash, filterHandle]);

    // watch filter summary and update filter type
    useEffect(() => {
      if (filterSummary?.isNotNull || filterSummary?.isNull) {
        setFilterType('EXISTS');
      } else {
        setFilterType('SELECT');
      }
    }, [filterSummary]);

    useEffect(() => {
      // map selectedFacetData to a lookup so that we have easy access to the counts per publisher key
      const selectedFacetLookup =
        selectedFacetData?.search?.facet?.field?.reduce((acc, x) => {
          acc[x.name] = x.count;
          return acc;
        }, {} as Record<string, number>) ?? {};
      setFacetLookup(selectedFacetLookup);
    }, [selectedFacetData]);

    const selectedStrings = selected.map((x) => x.toString());
    const facetSuggestions = facetData?.search?.facet?.field?.filter(
      (x) => !selectedStrings.includes(x.name)
    );

    const options = (
      <>
        <div className="g-flex-auto"></div>
        <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
          {filterType === 'SELECT' && (
            <>
              {selected.length > 0 && (
                <button
                  className={cn('g-mx-1 g-px-1', !!About && 'g-pe-3 g-border-r g-me-2')}
                  onClick={() => {
                    setFullField(filterHandle, [], []);
                  }}
                >
                  <MdDeleteOutline />
                </button>
              )}
              <SimpleTooltip delayDuration={300} title="Exclude selected">
                <button
                  className="g-px-1"
                  onClick={() => {
                    negateField(filterHandle, !useNegations);
                    setUseNegations(!useNegations);
                  }}
                >
                  {useNegations && <MdOutlineRemoveCircle />}
                  {!useNegations && <MdOutlineRemoveCircleOutline />}
                </button>
              </SimpleTooltip>
            </>
          )}

          <SimpleTooltip delayDuration={300} title="Filter by existence">
            <button
              className="g-px-1"
              onClick={() => {
                const backup = cleanUpFilter(cloneDeep(filter));
                setBackupFilter(backup);
                setFullField(filterHandle, [{ type: 'isNotNull' }], []);
              }}
            >
              <PiEmptyBold />
            </button>
          </SimpleTooltip>

          {About && (
            <AboutButton className="-g-me-1">
              <About />
            </AboutButton>
          )}
        </div>
      </>
    );

    if (filterType === 'EXISTS') {
      return (
        <>
          <div
            className={cn(
              'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-1.5 g-px-4 g-items-center g-pt-2',
              className
            )}
          >
            <button
              onClick={() => {
                if (backupFilter) setFilter(backupFilter);
                else setFullField(filterHandle, [], []);
              }}
            >
              <FormattedMessage id="filterSupport.backToSelect" />
            </button>

            <div className="g-flex-auto"></div>
            <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
              {About && (
                <AboutButton className="-g-me-1">
                  <About />
                </AboutButton>
              )}
            </div>
          </div>
          <div className="g-py-1.5 g-px-4 g-w-full">
            <Exists
              isEmpty={!!filterSummary?.isNull}
              onChange={({ isEmpty }: { isEmpty: boolean }) => {
                if (isEmpty) {
                  setFullField(filterHandle, [{ type: 'isNull' }], []);
                } else {
                  setFullField(filterHandle, [{ type: 'isNotNull' }], []);
                }
              }}
            />
          </div>
          <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
        </>
      );
    }

    return (
      <div className={cn('g-flex g-flex-col g-max-h-[100dvh]', className)}>
        <div className="g-flex g-flex-none">
          <div className="g-p-2 g-w-full">
            {suggestConfig && (
              <Suggest
                ref={ref}
                onSelect={(item) => add(filterHandle, item.key, useNegations)}
                className={cn(
                  'g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset'
                )}
                selected={selected}
                getSuggestions={suggestConfig.getSuggestions}
                render={suggestConfig.render}
                getStringValue={suggestConfig.getStringValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onApply?.();
                }}
              />
            )}
            {!suggestConfig && (
              <SearchInput
                ref={ref}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="g-w-full g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset"
                onKeyDown={(e) => {
                  // if user press enter, then update the value
                  if (e.key === 'Enter') {
                    if (e.currentTarget.value !== '' && q !== '') {
                      add(filterHandle, e.currentTarget.value, useNegations);
                      setQ('');
                      e.preventDefault();
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
            'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-1.5 g-px-4 g-items-center'
          )}
        >
          {selected.length > -1 && (
            <div className="g-flex-none g-text-xs g-font-bold">
              {useNegations && (
                <FormattedMessage id="counts.nExcluded" values={{ total: selected?.length }} />
              )}
              {!useNegations && (
                <FormattedMessage id="counts.nSelected" values={{ total: selected?.length }} />
              )}
            </div>
          )}
          {options}
        </div>
        <div className="g-flex-auto g-overflow-auto g-max-h-96 gbif-small-scrollbar">
          {selected.length > 0 && (
            <div className={cn('g-text-base g-mt-2 g-px-4')}>
              <div role="group" className="g-text-sm">
                {selected.map((x) => {
                  return (
                    <Option
                      isNegated={useNegations}
                      key={x}
                      className="g-mb-2"
                      onClick={() => {
                        toggle(filterHandle, x, useNegations);
                      }}
                      onKeyDown={(e) => (e.key === 'Enter' ? onApply?.({}) : null)}
                      checked={true}
                      // helpText="Longer description can go here"
                    >
                      <div className="g-flex g-items-center">
                        <span className="g-flex-auto">
                          <DisplayName id={x} />
                        </span>
                        {!useNegations &&
                          !selectedFacetLoading &&
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
          <AsyncOptions
            loading={facetLoading && (!facetSuggestions || facetSuggestions?.length === 0)}
            error={facetError}
            className="g-p-2 g-pt-2 g-px-4"
          >
            {facetSuggestions && facetSuggestions.length > 0 && (
              <div className={cn(selected.length > 0 && 'g-border-t')}>
                <StripeLoader active={facetLoading} />
                <div className="g-p-2 g-pt-2 g-px-4">
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
                            toggle(filterHandle, x.name, useNegations);
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
              </div>
            )}
          </AsyncOptions>
        </div>
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </div>
    );
  }
);
