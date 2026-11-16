import { getAsQuery } from '@/components/filters/filterTools';
import { FilterBarWithActions } from '@/components/filters/filterBarWithActions';
import { Paging } from '@/components/paging';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Input } from '@/components/ui/input';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useIntParam, useStringParam } from '@/hooks/useParam';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { cn } from '@/utils/shadcn';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { FormattedNumber } from 'react-intl';
import {
  dnaSearchConfig,
  dnaSearchContext,
  useDnaFilters,
} from './dnaSearch';
import { useDnaReferenceLibraries } from './useDnaReferenceLibraries';

const PAGE_SIZE = 20;

export function DnaReferenceLibraryList({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  // The taxon and target gene filters go to the url, as on the occurrence search
  const [filter, setFilter] = useFilterParams({
    filterConfig: dnaSearchConfig,
    paramsToRemove: [],
  });

  return (
    <SearchContextProvider searchContext={dnaSearchContext}>
      <FilterProvider filter={filter} onChange={setFilter}>
        <DnaReferenceLibraryResults title={title} className={className} />
      </FilterProvider>
    </SearchContextProvider>
  );
}

function DnaReferenceLibraryResults({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  const { filter, filterHash } = useContext(FilterContext);
  const filters = useDnaFilters();

  // Free text is not a server filter. It is kept in the url and filtered in the browser.
  // replace: typing in the search box should not add a history entry per keystroke
  const [q, setQ] = useStringParam({ key: 'q', replace: true });
  const [pageParam, setPage] = useIntParam({ key: 'page', defaultValue: 1 });
  // A non-numeric page in the url (e.g. page=abc) would be NaN, so fall back to the first page
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

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

  // Changing a filter or the search text starts again from the first page. This runs in an effect,
  // after the filter is in the url, so the two url updates do not overwrite each other. The first
  // render is skipped, so a shared link with page=3 keeps its page.
  const filterKey = `${filterHash}|${q ?? ''}`;
  const lastFilterKey = useRef(filterKey);
  useEffect(() => {
    if (lastFilterKey.current === filterKey) return;
    lastFilterKey.current = filterKey;
    if (pageParam !== 1) setPage(1);
  }, [filterKey, pageParam, setPage]);

  const { loading, error, truncated, datasets: loadedDatasets } = useDnaReferenceLibraries({
    predicate,
  });

  const datasets = useMemo(() => {
    const term = (q ?? '').trim().toLowerCase();
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
    <div className={cn('g-max-w-full g-m-auto', className)}>
      {title && <h4 className="g-text-lg g-font-semibold g-mb-4">{title}</h4>}

      <div className="g-flex g-flex-col g-gap-4 g-mb-6">
        <Input
          type="search"
          value={q ?? ''}
          onChange={(event) => setQ(event.target.value || undefined)}
          placeholder="Search by title, description or publisher"
          aria-label="Search by title, description or publisher"
        />
        <FilterBarWithActions filters={filters} />
      </div>

      {error && (
        <div className="g-prose">
          <p>Error loading data: {error.message}</p>
        </div>
      )}

      {loading && <CardListSkeleton />}

      {!loading && (
        <>
          {truncated && (
            <div className="g-prose">
              <p>Only the first results are shown, the list may be incomplete.</p>
            </div>
          )}
          <p className="g-text-sm g-text-slate-500 g-mb-4">
            <FormattedNumber value={datasets.length} /> datasets
          </p>

          {pageItems.map((dataset) => (
            <DatasetResult key={dataset.key} dataset={dataset} />
          ))}

          {datasets.length === 0 && !error && (
            <div className="g-prose">
              <p>No DNA reference libraries match these filters.</p>
            </div>
          )}

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
