import { SearchInput } from '@/components/searchInput';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircleOutline,
  MdOutlineRemoveCircle,
  MdArrowBack,
} from 'react-icons/md';
import { PiEmptyBold, PiEmptyFill } from 'react-icons/pi';
import { cn } from '@/utils/shadcn';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import useQuery from '@/hooks/useQuery';
import hash from 'object-hash';
import cloneDeep from 'lodash/cloneDeep';
import { Suggest } from './suggest';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Option, SkeletonOption } from './option';
import {
  AdditionalFilterProps,
  ApplyCancel,
  AsyncOptions,
  FacetQuery,
  FilterSummaryType,
  filterWildcardConfig,
  getAsQuery,
  getFilterSummary,
  WildcardQuery,
} from './filterTools';
import { useSearchContext } from '@/contexts/search';
import { AboutButton } from './aboutButton';
import { Exists } from './exists';
import StripeLoader from '../stripeLoader';
import { Button } from '../ui/button';

const initialSize = 25;

type WildcardProps = Omit<filterWildcardConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

export const WildcardFilter = React.forwardRef<HTMLInputElement, WildcardProps>(
  (
    {
      className,
      searchConfig,
      filterHandle,
      disallowLikeFilters,
      displayName: DisplayName,
      suggestQuery,
      queryKey,
      keepCase,
      onApply,
      onCancel,
      pristine,
      about,
    }: WildcardProps,
    ref
  ) => {
    const searchContext = useSearchContext();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, setFullField, setFilter, filterHash, negateField } =
      currentFilterContext;
    const [size, setSize] = useState(initialSize);
    const [selected, setSelected] = useState<string[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [q, setQ] = useState<string>('');
    const [backupFilter, setBackupFilter] = useState<FilterType | undefined>(undefined);
    const [filterSummary, setFilterSummary] = useState<FilterSummaryType>(
      getFilterSummary(filter, filterHandle)
    );
    const [filterType, setFilterType] = useState(
      filterSummary?.isNotNull || filterSummary?.isNull ? 'EXISTS' : 'SELECT'
    );
    const [useNegations, setUseNegations] = useState(filterSummary?.hasNegations ?? false);

    const { data, error, loading, load } = useQuery<WildcardQuery, unknown>(suggestQuery, {
      lazyLoad: true,
    });

    const About = about;

    useEffect(() => {
      const predicates = [];
      if (searchContext?.scope) {
        predicates.push(searchContext.scope);
      }
      let queryString = q;
      let postfix = '';
      if (queryString.indexOf('*') === -1 && queryString.indexOf('?') === -1) {
        postfix = '*';
      }
      queryString = `${q}${postfix}`;

      if (q && q !== '') {
        predicates.push({
          type: 'like',
          key: queryKey ?? filterHandle,
          value: `${queryString}`,
        });
      }

      let includePattern = queryString
        .replace(/\*/g, '.*')
        .replace(/\?/, '.')
        .replace(/([?+|{}[\]()"\\])/g, (_, p1) => '\\' + p1);
      if (!keepCase) includePattern = includePattern.toLowerCase();

      load({
        keepDataWhileLoading: size > initialSize,
        variables: {
          size,
          include: includePattern,
          predicate: {
            type: 'and',
            predicates: predicates,
          },
        },
      });
    }, [size, q, filterBeforeHash, keepCase]);

    const loadMore = useCallback(() => {
      setSize(size + 50);
    }, [size]);

    const search = useCallback((q: string) => {
      setSize(initialSize);
      setQ(q);
    }, []);

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
    }, [filterHash, filterHandle]);

    // watch filter summary and update filter type
    useEffect(() => {
      if (filterSummary?.isNotNull || filterSummary?.isNull) {
        setFilterType('EXISTS');
      } else {
        setFilterType('SELECT');
      }
    }, [filterSummary]);

    // no longer just strings, so I guess we have to revisit this
    const selectedStrings = selected.map((x) => x.toString());
    const facetSuggestions = data?.search?.facet?.field?.filter(
      (x) => !selectedStrings.includes(x.name)
    );

    const patternAlreadySelected = !!selected.find((x) => typeof x === 'object' && x.type === 'like' && x.value && x.value === q) || selectedStrings.includes(q);

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

    const cardinality = data?.search?.cardinality?.total ?? 0;
    const hasSuggestions = data?.search?.facet?.field && data?.search?.facet?.field?.length > 0;
    const hasMoreSuggestions = hasSuggestions && cardinality > (data?.search?.facet?.field?.length ?? 0);

    return (
      <div className={cn('g-flex g-flex-col g-max-h-[100dvh]', className)}>
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
        <div className="g-flex-auto g-overflow-auto g-max-h-96 [&::-webkit-scrollbar]:g-w-1 [&::-webkit-scrollbar-track]:g-bg-gray-100 [&::-webkit-scrollbar-thumb]:g-bg-gray-300">
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
                      </div>
                    </Option>
                  );
                })}
              </div>
            </div>
          )}
          <div className="g-flex g-flex-none g-border-t">
            <div className="g-p-2 g-w-full">
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
                      const query = e.currentTarget.value;
                      if (query.indexOf('*') > -1 || query.indexOf('?') > -1) {
                        const qString = { type: 'like', value: query };
                        add(filterHandle, qString, useNegations);
                      } else {
                        add(filterHandle, query, useNegations);
                      }
                      setQ('');
                      e.preventDefault();
                    } else {
                      onApply?.();
                    }
                  }
                }}
              />
            </div>
          </div>
          <div role="group" className="g-text-sm g-text-slate-700">
            <div className="g-p-2 g-pt-0 g-px-4">
              {!disallowLikeFilters && q !== '' && !patternAlreadySelected && (
                <div
                  className=""
                >
                  <Option
                    key={q}
                    helpText={
                      <FormattedMessage
                        id="filterSupport.useWildcardPattern"
                        defaultMessage="Search for the pattern"
                      />
                    }
                    onClick={() => {
                      // if q contains * or ? then it is a wildcard query else just a plain string match
                      if (q.indexOf('*') > -1 || q.indexOf('?') > -1) {
                        const qString = { type: 'like', value: q };
                        toggle(filterHandle, qString, useNegations);
                      } else {
                        toggle(filterHandle, q, useNegations);
                      }
                    }}
                  >
                    {q}
                  </Option>
                </div>
              )}
            </div>

            <AsyncOptions
              className="g-p-2 g-pt-0 g-px-4"
              loading={loading && (!facetSuggestions || facetSuggestions?.length === 0)}
              error={error}
            >
              {facetSuggestions && facetSuggestions.length > 0 && (
                <div>
                  <StripeLoader active={loading} />
                  <div className="g-p-2 g-pt-0 g-px-4">
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
                              {x?.name ?? <DisplayName id={x?.name} />}
                            </span>
                            <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                              <FormattedNumber value={x.count} />
                            </span>
                          </div>
                        </Option>
                      );
                    })}
                    {hasMoreSuggestions && !loading && <div style={{fontSize: 12, marginLeft: 24, marginTop: 12}}><Button variant="primaryOutline" size="sm" onClick={loadMore}>
                      <FormattedMessage id="search.loadMore" defaultMessage="More"/>
                    </Button></div>}
                    {loading && <>
                      <SkeletonOption className="g-w-full g-mb-2" />
                      <SkeletonOption className="g-w-36 g-max-w-full g-mb-2" />
                      <SkeletonOption className="g-max-w-full g-w-48 g-mb-2" />
                    </>}
                  </div>
                </div>
              )}
            </AsyncOptions>
          </div>
          {facetSuggestions && facetSuggestions.length === 0 && selected?.length === 0 && (
            <div className="g-p-4 g-text-center g-text-sm g-text-slate-400">
              No matching records.
            </div>
          )}
        </div>
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </div>
    );
  }
);
