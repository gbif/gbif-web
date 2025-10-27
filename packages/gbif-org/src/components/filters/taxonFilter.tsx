import { SimpleTooltip } from '@/components/simpleTooltip';
import { useConfig } from '@/config/config';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import hash from 'object-hash';
import React, { useContext, useEffect, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircle,
  MdOutlineRemoveCircleOutline,
} from 'react-icons/md';
import { PiEmptyBold } from 'react-icons/pi';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import StripeLoader from '../stripeLoader';
import { AboutButton } from './aboutButton';
import { DatasetLabel } from './displayNames';
import {
  AdditionalFilterProps,
  ApplyCancel,
  AsyncOptions,
  ExistsSection,
  FacetQuery,
  FilterSummaryType,
  filterTaxonConfig,
  getAsQuery,
  getFilterSummary,
} from './filterTools';
import { Option } from './option';
import { Suggest } from './suggest';

type TaxonSuggestProps = Omit<filterTaxonConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

export const TaxonFilter = React.forwardRef<HTMLInputElement, TaxonSuggestProps>(
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
      allowExistence,
      allowNegations,
      suggestionTitlePath,
    }: TaxonSuggestProps,
    ref
  ) => {
    const siteConfig = useConfig();
    const searchContext = useSearchContext();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, setFullField, setFilter, filterHash, negateField } =
      currentFilterContext;
    const [selected, setSelected] = useState<string[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [facetLookup, setFacetLookup] = useState<Record<string, number>>({});
    const [backupFilter, setBackupFilter] = useState<FilterType | undefined>(undefined);
    const [filterSummary, setFilterSummary] = useState<FilterSummaryType>(
      getFilterSummary(filter, filterHandle)
    );
    const [filterType, setFilterType] = useState(
      filterSummary?.isNotNull || filterSummary?.isNull ? 'EXISTS' : 'SELECT'
    );
    const [useNegations, setUseNegations] = useState(filterSummary?.hasNegations ?? false);
    const availableChecklistKeys = siteConfig.availableChecklistKeys ?? [];

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
        facetLoad({ variables: query, keepDataWhileLoading: true });
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
        selectedFacetLoad({ variables: { ...query, size: selected?.length ?? 10 } });
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
      filter,
      filterSummary?.isNotNull,
      filterSummary?.isNull,
      filterSummary?.mixed,
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
              {allowNegations && (
                <button
                  className="g-px-1"
                  onClick={() => {
                    negateField(filterHandle, !useNegations);
                    setUseNegations(!useNegations);
                  }}
                >
                  <SimpleTooltip
                    delayDuration={300}
                    title={<FormattedMessage id="filterSupport.excludeSelected" />}
                    asChild
                  >
                    <span>
                      {useNegations && <MdOutlineRemoveCircle />}
                      {!useNegations && <MdOutlineRemoveCircleOutline />}
                    </span>
                  </SimpleTooltip>
                </button>
              )}
            </>
          )}

          {allowExistence && (
            <button
              className="g-px-1"
              onClick={() => {
                const backup = cleanUpFilter(cloneDeep(filter));
                setBackupFilter(backup);
                setFullField(filterHandle, [{ type: 'isNotNull' }], []);
              }}
            >
              <SimpleTooltip
                delayDuration={300}
                title={<FormattedMessage id="filterSupport.existence" />}
                asChild
              >
                <span>
                  <PiEmptyBold />
                </span>
              </SimpleTooltip>
            </button>
          )}

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
        <ExistsSection
          className={className}
          backupFilter={backupFilter}
          setFilter={setFilter}
          setFullField={setFullField}
          filterHandle={filterHandle}
          About={About}
          filterSummary={filterSummary}
          onApply={onApply}
          onCancel={onCancel}
          pristine={pristine}
        />
      );
    }

    return (
      <div className={cn('g-flex g-flex-col g-max-h-[100dvh]', className)}>
        <div className="g-flex g-flex-none">
          <div className="g-p-2 g-w-full">
            {availableChecklistKeys.length > 1 && (
              <div className="g-text-xs g-text-slate-500 g-mb-0.5 g-gap-1 gbif__taxonomy-filter__checklist-selector">
                <select
                  className="g-flex-auto g-max-w-full"
                  value={filter.checklistKey}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    const newFilter = setFullField(filterHandle, [], []);
                    setFilter({ ...newFilter, checklistKey: selectedValue });
                  }}
                >
                  {availableChecklistKeys.map((key) => (
                    <option key={key} value={key}>
                      <DatasetLabel id={key} />
                    </option>
                  ))}
                </select>
              </div>
            )}
            {suggestConfig && (
              <Suggest
                ref={ref}
                onSelect={(item) =>
                  add(filterHandle, item.acceptedUsageId ?? item.usageId ?? item.key, useNegations)
                }
                className={cn(
                  'g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset'
                )}
                selected={selected}
                getSuggestions={(args) => {
                  return suggestConfig.getSuggestions({
                    ...args,
                    checklistKey: filter.checklistKey,
                  });
                }}
                render={suggestConfig.render}
                getStringValue={suggestConfig.getStringValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onApply?.();
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
        <div className="g-flex-auto sm:g-overflow-auto sm:g-max-h-96 gbif-small-scrollbar">
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
                          <DisplayName id={x} checklistKey={filter.checklistKey} />
                        </span>
                        {!useNegations &&
                          !selectedFacetLoading &&
                          !selectedFacetError &&
                          !disableFacetsForSelected && (
                            <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                              {typeof facetLookup[x] === 'number' && (
                                <FormattedNumber value={facetLookup[x]} />
                              )}
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
              <FormattedMessage id="filterSupport.noSuggestions" />
            </div>
          )}
          <AsyncOptions
            loading={facetLoading || (!facetSuggestions && !!facetQuery)}
            error={facetError && !facetSuggestions}
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
                              {get(x, suggestionTitlePath ?? 'item.usage.canonicalName') ?? (
                                <DisplayName id={x?.name} />
                              )}
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
