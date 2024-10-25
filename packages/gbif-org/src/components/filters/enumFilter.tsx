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
import hash from 'object-hash';
import { PiEmptyBold, PiEmptyFill } from 'react-icons/pi';
import { TiArrowShuffle as InvertIcon } from 'react-icons/ti';
import { cn } from '@/utils/shadcn';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import useQuery from '@/hooks/useQuery';
import { FormattedNumber } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { FacetQuery, getAsQuery } from './filterTools';
import { Option } from './option';
import cloneDeep from 'lodash/cloneDeep';
import { useSearchContext } from '@/contexts/search';
import { AboutButton } from './aboutButton';

export const EnumFilter = React.forwardRef(
  (
    {
      className,
      searchConfig,
      filterHandle,
      DisplayName,
      facetQuery,
      enumOptions,
      onApply,
      onCancel,
      pristine,
      about
    }: {
      className?: string;
      searchConfig: FilterConfigType;
      filterHandle: string;
      DisplayName: React.FC<{ id: string }>;
      facetQuery?: string;
      enumOptions?: string[];
      onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
      onCancel?: () => void;
      pristine?: boolean;
      about?: React.FC;
    },
    ref
  ) => {
    const searchContext = useSearchContext();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, setFullField, filterHash } = currentFilterContext;
    const [selected, setSelected] = useState<string[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);

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

      const query = getAsQuery({ filter: prunedFilter, searchContext, searchConfig });
      if (searchContext.queryType === 'V1') {
        facetLoad({ variables: { query: query } });
      } else {
        facetLoad({ variables: { predicate: query } });
      }
    }, [facetQuery, filterBeforeHash, facetLoad, searchContext, searchConfig, filterHandle]);

    useEffect(() => {
      const selectedList = filter?.must?.[filterHandle] ?? [];
      setSelected(selectedList);

      // secondly keep track the facets without the current filter
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      setFilterBeforeHash(hash(prunedFilter));
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
          {/* <SimpleTooltip delayDuration={300} title="Exclude selected">
          <button
            className="g-px-1"
            onClick={() => {
              // negateField('fieldName', true)
            }}
          >
            <MdOutlineRemoveCircleOutline />
          </button>
        </SimpleTooltip> */}
          <SimpleTooltip delayDuration={300} title="Invert selection">
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
          {/* <SimpleTooltip delayDuration={300} title="Filter by existence">
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
      <div
        className="g-flex g-flex-col g-overflow-hidden"
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
            <div className="g-flex-none g-text-xs g-font-bold">{selected?.length} selected</div>
          )}
          {options}
        </div>
        <div className="g-flex-auto g-overflow-auto">
          <div className={cn('g-text-base g-mt-2 g-px-4', className)}>
            <div role="group" className="g-text-sm">
              {valueOptions &&
                valueOptions.map((x, i) => {
                  return (
                    <Option
                      key={x}
                      ref={i === 0 ? ref : undefined}
                      className="g-mb-2"
                      onClick={() => toggle(filterHandle, x)}
                      checked={selected.includes(x.toString())}
                      // helpText="Longer description can go here"
                    >
                      <div className="g-flex g-items-center">
                        <span className="g-flex-auto">
                          <DisplayName id={x} />
                        </span>
                        <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                          {facetSuggestions && <FormattedNumber value={facetSuggestions[x] ?? 0} />}
                        </span>
                      </div>
                    </Option>
                  );
                })}
            </div>
          </div>
        </div>
        {onApply && onCancel && (
          <div className="g-flex-none g-py-2 g-px-2 g-flex g-justify-between">
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {!pristine && (
              <Button size="sm" onClick={() => onApply({ keepOpen: false })}>
                Apply
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
