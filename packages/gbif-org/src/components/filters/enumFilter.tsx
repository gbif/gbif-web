import { SimpleTooltip } from '@/components/simpleTooltip';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import cloneDeep from 'lodash/cloneDeep';
import hash from 'object-hash';
import React, { useContext, useEffect, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircle,
  MdOutlineRemoveCircleOutline,
  MdShuffle,
} from 'react-icons/md';
import { PiEmptyBold } from 'react-icons/pi';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { AboutButton } from './aboutButton';
import {
  AdditionalFilterProps,
  ApplyCancel,
  AsyncOptions,
  ExistsSection,
  FacetQuery,
  filterEnumConfig,
  FilterSummaryType,
  getAsQuery,
  getFilterSummary,
} from './filterTools';
import { Option } from './option';

type EnumProps = Omit<filterEnumConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

export const EnumFilter = React.forwardRef(
  (
    {
      className,
      searchConfig,
      filterHandle,
      displayName: DisplayName,
      facetQuery,
      options: enumOptions,
      onApply,
      onCancel,
      pristine,
      about,
      allowNegations,
      allowExistence,
    }: EnumProps,
    ref
  ) => {
    const searchContext = useSearchContext();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, setFullField, negateField, setFilter, filterHash } =
      currentFilterContext;
    const [selected, setSelected] = useState<string[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [backupFilter, setBackupFilter] = useState<FilterType | undefined>(undefined);
    const [filterSummary, setFilterSummary] = useState<FilterSummaryType>(
      getFilterSummary(filter, filterHandle)
    );
    const [filterType, setFilterType] = useState(
      filterSummary?.isNotNull || filterSummary?.isNull ? 'EXISTS' : 'SELECT'
    );
    const [useNegations, setUseNegations] = useState(filterSummary?.hasNegations ?? false);

    const {
      data: facetData,
      error: facetError,
      loading: facetLoading,
      load: facetLoad,
    } = useQuery<FacetQuery, unknown>(facetQuery ?? '', {
      lazyLoad: true,
    });

    const {
      data: noFilterFacetData,
      error: noFilterFacetError,
      loading: noFilterFacetLoading,
      load: noFilterFacetLoad,
    } = useQuery<FacetQuery, unknown>(facetQuery ?? '', {
      lazyLoad: true,
    });

    // watch filter summary and update filter type
    useEffect(() => {
      if (filterSummary?.isNotNull || filterSummary?.isNull) {
        setFilterType('EXISTS');
      } else {
        setFilterType('SELECT');
      }
    }, [filterSummary]);

    useEffect(() => {
      // if no enums are provided, then get facet values from API using no filters. This will provide is with the possible values for that field.
      // TODO this should be changed to take into account the scope defined at site level
      if (!enumOptions && facetQuery) {
        const query = getAsQuery({ filter: {}, searchContext, searchConfig });
        if (searchContext.queryType === 'V1') {
          noFilterFacetLoad({ variables: { query: query } });
        } else {
          noFilterFacetLoad({ variables: { predicate: query } });
        }
      }
    }, [enumOptions, facetQuery, noFilterFacetLoad, searchContext, searchConfig]);

    useEffect(() => {
      if (!facetQuery) return;
      // if the filter has changed, then get facet values from API
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      delete prunedFilter.mustNot?.[filterHandle];

      const query = getAsQuery({ filter: prunedFilter, searchContext, searchConfig });
      if (searchContext.queryType === 'V1') {
        facetLoad({ variables: { query: query } });
      } else {
        facetLoad({ variables: { predicate: query } });
      }
    }, [facetQuery, filterBeforeHash, facetLoad, searchContext, searchConfig, filterHandle]);

    useEffect(() => {
      const selectedList = filter?.must?.[filterHandle] ?? filter?.mustNot?.[filterHandle] ?? [];
      setSelected(selectedList.map((x) => x.toString()));

      // secondly keep track the facets without the current filter
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      setFilterBeforeHash(hash(prunedFilter));

      const filterSummary = getFilterSummary(filter, filterHandle);
      setFilterSummary(filterSummary);
      // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterHash, filterHandle]);

    const facetSuggestions = facetData?.search?.facet?.field?.reduce(
      (acc: Record<string, number>, x) => {
        if (x?.name) {
          acc[x.name] = x.count;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const useFacetOptions = !enumOptions && noFilterFacetData?.search?.facet?.field;
    const valueOptions = useFacetOptions
      ? noFilterFacetData?.search?.facet?.field?.filter((x) => x).map((x) => x.name) ?? []
      : enumOptions ?? [];

    const About = about;
    const options = (
      <>
        <div className="g-flex-auto"></div>
        <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
          {selected.length > 0 && (
            <button
              className="g-mx-1 g-me-2 g-px-1 g-pe-3 g-border-r"
              onClick={() => setFullField(filterHandle, [], [])}
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

          <SimpleTooltip
            delayDuration={300}
            title={<FormattedMessage id="filterSupport.invert" />}
            asChild
          >
            <span>
              <button
                className="g-px-1"
                onClick={() => {
                  // reverse selection
                  const newSelected = valueOptions.filter((x) => !selected.includes(x));
                  setFullField(filterHandle, newSelected, []);
                }}
              >
                <MdShuffle />
              </button>
            </span>
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
      <div
        className="g-flex g-flex-col g-overflow-hidden g-max-h-[90dvh]"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (typeof onApply === 'function') {
              onApply();
            }
          }
        }}
      >
        <div
          onFocusCapture={(e) => {
            // https://github.com/radix-ui/primitives/issues/2248#issuecomment-2147056904
            // radix quirk. Doing this prevents tooltips from showing when opening in a popover
            // since it also removed popovers on keyboard navigation, we only do so when there is no default checkboxes to take focus
            e.stopPropagation();
          }}
          className={cn(
            'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-1.5 g-px-4 g-items-center',
            className
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
          <div className={cn('g-text-base', className)}>
            {facetSuggestions && facetSuggestions.length === 0 && selected?.length === 0 && (
              <div className="g-p-4 g-text-center g-text-sm g-text-slate-400">
                <FormattedMessage id="filterSupport.noSuggestions" />
              </div>
            )}
            <AsyncOptions
              loading={facetLoading || (!facetSuggestions && !!facetQuery)}
              error={facetError}
              className="g-p-2 g-pt-2 g-px-4"
            >
              <div role="group" className="g-text-sm g-p-2 g-pt-2 g-px-4">
                {valueOptions &&
                  valueOptions.map((x, i) => {
                    return (
                      <Option
                        isNegated={useNegations}
                        key={x}
                        ref={i === 0 ? ref : undefined}
                        className="g-mb-2"
                        onClick={() => {
                          toggle(filterHandle, x, useNegations);
                        }}
                        checked={selected.includes(x.toString())}
                        // helpText="Longer description can go here"
                      >
                        <div className="g-flex g-items-center">
                          <span className="g-flex-auto">
                            <DisplayName id={x} />
                          </span>
                          <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                            {facetSuggestions && (
                              <FormattedNumber value={facetSuggestions[x] ?? 0} />
                            )}
                          </span>
                        </div>
                      </Option>
                    );
                  })}
              </div>
            </AsyncOptions>
          </div>
        </div>
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </div>
    );
  }
);
