import { ErrorMessage } from '@/components/errorMessage';
import { FilterBarWithActions } from '@/components/filters/filterBarWithActions';
import { getAsQuery } from '@/components/filters/filterTools';
import { NoRecords } from '@/components/noDataMessages';
import { Paging } from '@/components/paging';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useIntParam } from '@/hooks/useParam';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { cn } from '@/utils/shadcn';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { dnaSearchConfig, dnaSearchContext, useDnaFilters } from './dnaSearch';
import { MAX_DATASETS, useDnaReferenceLibraries } from './useDnaReferenceLibraries';

const PAGE_SIZE = 20;

export function DnaReferenceLibraryList({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  const config = useConfig();
  // The search text, taxon and target gene filters go to the url, as on the occurrence search.
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

  // The predicate for the current filters. The DNA reference library scope is part of it, the
  // search text is not, as it is filtered in the browser.
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
  const firstQ = filter?.must?.q?.[0];
  const q = typeof firstQ === 'string' ? firstQ : '';

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

      <FilterBarWithActions filters={filters} className="g-mb-6" />

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
