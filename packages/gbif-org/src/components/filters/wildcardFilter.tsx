import { SearchInput } from '@/components/searchInput';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import cloneDeep from 'lodash/cloneDeep';
import hash from 'object-hash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircle,
  MdOutlineRemoveCircleOutline,
} from 'react-icons/md';
import { PiEmptyBold } from 'react-icons/pi';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import StripeLoader from '../stripeLoader';
import { Button } from '../ui/button';
import { AboutButton } from './aboutButton';
import {
  AdditionalFilterProps,
  ApplyCancel,
  AsyncOptions,
  ExistsSection,
  FilterSummaryType,
  filterWildcardConfig,
  getAsQuery,
  getFilterSummary,
  WildcardQuery,
} from './filterTools';
import { Option, SkeletonOption } from './option';

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
      allowExistence,
      allowNegations,
      defaultDescription,
    }: WildcardProps,
    ref
  ) => {
    const searchContext = useSearchContext();
    const { formatMessage } = useIntl();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, setFullField, setFilter, filterHash, negateField } =
      currentFilterContext;
    const [size, setSize] = useState(initialSize);
    const [selected, setSelected] = useState<string[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [q, setQ] = useState<string>('');
    const [prunedFilter, setPrunedFilter] = useState<FilterType>({});
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
      const query = getAsQuery({ filter: prunedFilter, searchContext, searchConfig });
      const predicates = query?.predicate ? [query?.predicate] : [];
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

      // if there is no predicates, then predicate is undefined.
      // if it has length === 1, then just use that
      // and if has 2 items or more, then use and AND preidcate
      let predicate = undefined;
      if (predicates.length === 1) {
        predicate = predicates[0];
      } else if (predicates.length > 1) {
        predicate = {
          type: 'and',
          predicates: predicates,
        };
      }
      load({
        keepDataWhileLoading: size > initialSize,
        variables: {
          size,
          include: includePattern,
          predicate,
        },
      });
      // We are tracking filter changes via a hash in this case
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      size,
      q,
      filterBeforeHash,
      keepCase,
      load,
      searchContext,
      filterHandle,
      queryKey,
      searchConfig,
      filterBeforeHash,
    ]);

    const loadMore = useCallback(() => {
      setSize(size + 50);
    }, [size]);

    const loadingMore =
      loading && data?.search.facet?.field != null && data.search.facet.field.length < size;

    useEffect(() => {
      // filter has changed updateed the listed of selected values
      const selectedList = filter?.must?.[filterHandle] ?? filter?.mustNot?.[filterHandle] ?? [];
      setSelected(selectedList);

      // secondly keep track the facets without the current filter
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      delete prunedFilter.mustNot?.[filterHandle];
      setFilterBeforeHash(hash(prunedFilter));
      setPrunedFilter(prunedFilter);

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

    // no longer just strings, so I guess we have to revisit this
    const selectedStrings = selected.map((x) => x.toString());
    const facetSuggestions = data?.search?.facet?.field?.filter(
      (x) => !selectedStrings.includes(x.name)
    );

    const patternAlreadySelected =
      !!selected.find(
        (x) => typeof x === 'object' && x.type === 'like' && x.value && x.value === q
      ) || selectedStrings.includes(q);

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

    const DefaultDescription = defaultDescription;

    const cardinality = data?.search?.cardinality?.total ?? 0;
    const hasSuggestions = data?.search?.facet?.field && data?.search?.facet?.field?.length > 0;
    const hasMoreSuggestions =
      hasSuggestions && cardinality > (data?.search?.facet?.field?.length ?? 0);
    const hasFilters =
      Object.keys(prunedFilter.must ?? {}).length > 0 ||
      Object.keys(prunedFilter.mustNot ?? {}).length > 0;

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
                placeholder={formatMessage({ id: 'search.placeholders.default' })}
                className="g-text-sm g-w-full g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border g-border-solid focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset"
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
                      e.preventDefault();
                    } else {
                      onApply?.();
                    }
                  }
                }}
              />
            </div>
          </div>
          {q === '' && DefaultDescription && (
            <div className="g-text-slate-600 g-text-sm g-bg-slate-50 g-border g-border-solid  g-border-slate-100 g-p-2 g-mx-2 g-px-4 g-rounded">
              <DefaultDescription />
            </div>
          )}
          <div role="group" className="g-text-sm g-text-slate-700">
            <div className="g-p-2 g-pt-0 g-px-4">
              {!disallowLikeFilters && q !== '' && !patternAlreadySelected && (
                <div className="">
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
              loading={loading || !facetSuggestions}
              loadingMore={loadingMore}
              error={error}
            >
              {facetSuggestions && facetSuggestions.length > 0 && (
                <div>
                  <StripeLoader active={loading} />
                  {hasFilters && q !== '' && (
                    <div className="g-text-slate-500 g-text-xs g-border-t g-mx-4 g-py-2">
                      <FormattedMessage
                        id="filterSupport.suggestionsWithinFilter"
                        defaultMessage="Suggestions within your current filter"
                      />
                    </div>
                  )}
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
                    {hasMoreSuggestions && !loading && (
                      <div style={{ fontSize: 12, marginLeft: 24, marginTop: 12 }}>
                        <Button variant="primaryOutline" size="sm" onClick={loadMore}>
                          <FormattedMessage id="search.loadMore" defaultMessage="More" />
                        </Button>
                      </div>
                    )}
                    {loading && (
                      <>
                        <SkeletonOption className="g-w-full g-mb-2" />
                        <SkeletonOption className="g-w-36 g-max-w-full g-mb-2" />
                        <SkeletonOption className="g-max-w-full g-w-48 g-mb-2" />
                      </>
                    )}
                  </div>
                </div>
              )}
            </AsyncOptions>
          </div>
          {facetSuggestions && facetSuggestions.length === 0 && selected?.length === 0 && (
            <div className="g-p-4 g-text-center g-text-sm g-text-slate-400">
              <FormattedMessage id="filterSupport.noSuggestions" />
            </div>
          )}
        </div>
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </div>
    );
  }
);
