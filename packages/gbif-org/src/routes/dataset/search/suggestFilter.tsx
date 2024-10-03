import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import { filter2v1 } from '@/dataManagement/filterAdapter';
import useQuery from '@/hooks/useQuery';
import hash from 'object-hash';
import cloneDeep from 'lodash/cloneDeep';
import { Suggest } from './suggest';
import { HelpLine } from '@/components/helpText';
import { FormattedNumber, IntlShape } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Option } from './option';
import { FacetQuery } from './filterTools';

export const SuggestFilter = React.forwardRef(
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
      ...props
    }: {
      className?: string;
      searchConfig: FilterConfigType;
      filterHandle: string;
      DisplayName: React.FC<{ id: string }>;
      facetQuery: string;
      getSuggestions?: ({ q, intl }: { q: string; intl: IntlShape }) => Promise<any>;
      onApply?: ({ keepOpen }: { keepOpen?: boolean }) => void;
      onCancel?: () => void;
    },
    ref
  ) => {
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, remove, setFullField, negateField, filterHash } =
      currentFilterContext;
    const [selected, setSelected] = useState<string[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [facetLookup, setFacetLookup] = useState<Record<string, number>>({});
    const [q, setQ] = useState<string>('');

    const {
      data: facetData,
      error: facetError,
      loading: facetLoading,
      load: facetLoad,
    } = useQuery<FacetQuery, any>(facetQuery, {
      lazyLoad: true,
    });

    const {
      data: selectedFacetData,
      error: selectedFacetError,
      loading: selectedFacetLoading,
      load: selectedFacetLoad,
    } = useQuery<FacetQuery, any>(facetQuery, {
      lazyLoad: true,
    });

    useEffect(() => {
      // if the filter has changed, then get facet values from API
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      const v1Filter = filter2v1(prunedFilter, searchConfig);
      facetLoad({ variables: { query: v1Filter?.filter } });
    }, [filterBeforeHash]);

    useEffect(() => {
      // if the filter has changed, then get facet values from API
      const v1Filter = filter2v1(filter, searchConfig);
      selectedFacetLoad({ variables: { query: v1Filter?.filter } });
    }, [filterHash]);

    // useEffect(() => {
    //   const prunedFilter = cleanUpFilter(cloneDeep(filterBeforeChanges));
    //   delete prunedFilter.must?.[filterHandle];
    //   setFilterBeforeHash(hash(prunedFilter));
    // }, [filterBeforeChanges]);

    useEffect(() => {
      // filter has changed updateed the listed of selected values
      const selectedList = filter?.must?.[filterHandle] ?? [];
      setSelected(selectedList);

      // secondly keep track the facets without the current filter
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      setFilterBeforeHash(hash(prunedFilter));
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

    const facetSuggestions = facetData?.search?.facet?.field?.filter(
      (x) => !selected.includes(x.name)
    );

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

          <SimpleTooltip delayDuration={300} title="About this filter">
            <span>
              <HelpLine
                id="how-to-link-datasets-to-my-project-page"
                title={<MdInfoOutline className="-g-me-1" />}
              />
            </span>
          </SimpleTooltip>
        </div>
      </>
    );

    return (
      <div className="g-flex g-flex-col">
        <div className="g-flex g-flex-none">
          {getSuggestions && (
            <Suggest
              ref={ref}
              onSelect={(item) => add(filterHandle, item.key)}
              className={cn('g-border-slate-100 g-border-b-2 g-py-1.5 g-px-4', className)}
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
              className="g-border-slate-100 g-w-full g-border-b-2 g-py-1.5 g-px-4"
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
        <div className="g-flex-auto g-overflow-auto">
          {selected.length > 0 && (
            <div className={cn('g-text-base g-mt-2 g-px-4', className)}>
              <div role="group" className="g-text-sm">
                {selected.map((x) => {
                  return (
                    <Option
                      key={x}
                      className="g-mb-2"
                      onClick={() => toggle(filterHandle, x)}
                      checked={true}
                      // helpText="Longer description can go here"
                    >
                      <div className="g-flex g-items-center">
                        <span className="g-flex-auto">
                          <DisplayName id={x} />
                        </span>
                        <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                          <FormattedNumber value={facetLookup[x] ?? 0} />
                        </span>
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
          {facetSuggestions && facetSuggestions.length > 0 && (
            <div
              className={cn(`g-p-2 g-pt-2 g-px-4 `, selected.length > 0 && 'g-border-t', className)}
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
        </div>
        {(onApply && onCancel) && (
          <div className="g-flex-none g-py-2 g-px-2 g-flex g-justify-between g-border-t">
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={onApply}>
              Apply
            </Button>
          </div>
        )}
      </div>
    );
  }
);
