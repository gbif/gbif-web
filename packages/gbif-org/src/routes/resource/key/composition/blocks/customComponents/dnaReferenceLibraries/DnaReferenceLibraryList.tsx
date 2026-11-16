import { ErrorMessage } from '@/components/errorMessage';
import { FilterBarWithActions } from '@/components/filters/filterBarWithActions';
import { getAsQuery } from '@/components/filters/filterTools';
import { NoRecords } from '@/components/noDataMessages';
import { Paging } from '@/components/paging';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Input } from '@/components/ui/input';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useIntParam } from '@/hooks/useParam';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { cn } from '@/utils/shadcn';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { dnaSearchConfig, dnaSearchContext, useDnaFilters } from './dnaSearch';
import { MAX_DATASETS, useDnaReferenceLibraries } from './useDnaReferenceLibraries';

const PAGE_SIZE = 20;
// How long to wait after the last keystroke before the search text goes to the url
const SEARCH_DEBOUNCE_MS = 300;
// The url params of this list, all removed by "clear all". The filter params follow the filter config
// (as useFilterParams writes them), plus the encoded filter and checklist params it also uses.
const FILTER_URL_PARAMS = [
  ...Object.entries(dnaSearchConfig.fields ?? {}).map(([key, field]) => field?.defaultKey ?? key),
  'filter',
  'checklistKey',
  'q',
  'page',
];

export function DnaReferenceLibraryList({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  const config = useConfig();
  // The taxon and target gene filters go to the url, as on the occurrence search.
  // A filter change removes the page param in the same url update, so it starts on the first page.
  const [filter, setFilter] = useFilterParams({
    filterConfig: dnaSearchConfig,
    paramsToRemove: ['page'],
    defaultChecklistKey: config.defaultChecklistKey,
  });

  return (
    <SearchContextProvider searchContext={dnaSearchContext}>
      <FilterProvider filter={filter} onChange={setFilter}>
        <DnaReferenceLibraryResults title={title} className={className} />
      </FilterProvider>
    </SearchContextProvider>
  );
}

function DnaReferenceLibraryResults({ title, className }: { title?: string; className?: string }) {
  const { formatMessage } = useIntl();
  const { filter, filterHash } = useContext(FilterContext);
  const filters = useDnaFilters();
  // The top of the list, scrolled to when the page changes
  const topRef = useRef<HTMLDivElement>(null);

  const [pageParam, setPageParam] = useIntParam({
    key: 'page',
    defaultValue: 1,
    hideDefault: true,
  });
  // A non-numeric page in the url (e.g. page=abc) would be NaN, so fall back to the first page
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const setPage = useCallback(
    (next: number) => {
      setPageParam(next);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [setPageParam]
  );

  // The predicate for the current filters. The DNA reference library scope is part of it.
  const predicate = useMemo(
    () =>
      getAsQuery({
        filter,
        searchContext: dnaSearchContext,
        searchConfig: dnaSearchConfig,
      }).predicate as Record<string, unknown> | undefined,
    // filterHash changes whenever the filter does, so it is used as the dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterHash]
  );

  // Free text is not a server filter. It is kept in the url (q) and filtered in the browser.
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  // Sets the search text and goes back to the first page, in one url update.
  // replace: the search text should not add a history entry each time typing pauses
  const setQ = useCallback(
    (value: string) =>
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);
          if (value) next.set('q', value);
          else next.delete('q');
          next.delete('page');
          return next;
        },
        { replace: true, preventScrollReset: true }
      ),
    [setSearchParams]
  );
  // "Clear all" also clears the search text. It removes the filter params, the search text and the
  // page in one url update, as two separate updates could overwrite each other.
  const clearAll = useCallback(
    () =>
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);
          FILTER_URL_PARAMS.forEach((param) => next.delete(param));
          return next;
        },
        { preventScrollReset: true }
      ),
    [setSearchParams]
  );

  // The search box has its own state, so typing is not held up by the url update. It goes to the
  // url once typing pauses, and follows the url when that changes from elsewhere, e.g. back and
  // forward or "clear all".
  const [searchText, setSearchText] = useState(q);
  const lastSentText = useRef(q);
  useEffect(() => {
    if (q !== lastSentText.current) {
      lastSentText.current = q;
      setSearchText(q);
    }
  }, [q]);
  useEffect(() => {
    const text = searchText.trim();
    if (text === lastSentText.current) return;
    const timer = setTimeout(() => {
      lastSentText.current = text;
      setQ(text);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchText, setQ]);

  const {
    loading,
    error,
    truncated,
    datasets: loadedDatasets,
  } = useDnaReferenceLibraries({
    predicate,
  });

  const datasets = useMemo(() => {
    const term = q.trim().toLowerCase();
    return loadedDatasets
      .filter(
        (dataset) =>
          !term ||
          [
            dataset.title,
            // descriptions are HTML, match on the text only
            dataset.description?.replace(/<[^>]*>/g, ' '),
            dataset.excerpt,
            dataset.publishingOrganizationTitle,
          ].some((value) => value?.toLowerCase().includes(term))
      )
      .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
  }, [loadedDatasets, q]);

  const totalPages = Math.max(1, Math.ceil(datasets.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageItems = datasets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div ref={topRef} className={cn('g-max-w-full g-m-auto g-scroll-mt-24', className)}>
      {title && <h4 className="g-text-lg g-font-semibold g-mb-4">{title}</h4>}

      <div className="g-flex g-flex-col g-gap-4 g-mb-6">
        <Input
          type="search"
          className="g-bg-white"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={formatMessage({ id: 'dnaReferenceLibrary.searchPlaceholder' })}
          aria-label={formatMessage({ id: 'dnaReferenceLibrary.searchPlaceholder' })}
        />
        <FilterBarWithActions filters={filters} onClear={clearAll} />
      </div>

      {error && (
        <ErrorMessage className="g-mb-4">
          <FormattedMessage id="phrases.failedToLoadData" />
        </ErrorMessage>
      )}

      {loading && <CardListSkeleton />}

      {!loading && !error && (
        <>
          {truncated && (
            <p className="g-text-sm g-text-slate-500 g-mb-2">
              <FormattedMessage
                id="dnaReferenceLibrary.truncated"
                values={{ total: MAX_DATASETS }}
              />
            </p>
          )}
          <p className="g-text-sm g-text-slate-500 g-mb-4">
            <FormattedMessage id="counts.nDatasets" values={{ total: datasets.length }} />
          </p>

          {pageItems.map((dataset) => (
            <DatasetResult key={dataset.key} dataset={dataset} />
          ))}

          {datasets.length === 0 && <NoRecords messageId="dnaReferenceLibrary.noResults" />}

          {datasets.length > PAGE_SIZE && (
            <div className="g-flex g-p-4">
              <div className="g-flex-auto" />
              <Paging
                next={() => setPage(Math.min(totalPages, currentPage + 1))}
                prev={() => setPage(Math.max(1, currentPage - 1))}
                isFirstPage={currentPage === 1}
                isLastPage={currentPage >= totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
