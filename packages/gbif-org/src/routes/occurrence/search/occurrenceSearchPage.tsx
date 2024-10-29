import { Drawer } from '@/components/drawer/drawer';
import { InternalScrollHandler } from '@/components/internalScrollHandler';
import { TableFilters } from '@/components/tableFilters/tableFilters';
import { DataTable } from '@/components/ui/dataTable';
import { useConfig } from '@/config/config';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useColumns } from '@/routes/occurrence/search/columns';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { StandaloneOccurrenceKeyPage } from '../key/standalone';
import { DataHeader } from '@/components/dataHeader';
import { Tabs } from '@/components/tabs';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { searchConfig } from './searchConfig';
import { useFilters } from './filters';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { AboutContent, ApiContent } from './helpTexts';
import { useIntParam, useStringParam } from '@/hooks/useParam';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/utils/shadcn';
import { Map } from './views/map';
import { Media } from './views/media';
import { Clusters } from './views/clusters';
import { Dashboard } from './views/dashboard';
import { Download } from './views/download';

const OCCURRENCE_SEARCH_QUERY = /* GraphQL */ `
  query OccurrenceSearch($from: Int, $size: Int, $predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          key
          scientificName
          eventDate
          coordinates
          county
          countryCode
          basisOfRecord
          datasetName
          publisherTitle
        }
      }
    }
  }
`;

export type SingleOccurrenceSearchResult = ExtractPaginatedResult<
  OccurrenceSearchQuery['occurrenceSearch']
>;

const PAGE_SIZE = 20;

export function OccurrenceSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({ filterConfig: searchConfig });
  const config = useConfig();
  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>
      <SearchContextProvider searchContext={config.occurrenceSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <OccurrenceSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function OccurrenceSearch(): React.ReactElement {
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [view, setView] = useStringParam({ key: 'view', defaultValue: 'table', hideDefault: true });
  const [from] = useIntParam({ key: 'from', defaultValue: 0 });

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const [previewKey, setPreviewKey] = useState<string | null>();

  const { data, error, load, loading } = useQuery<
    OccurrenceSearchQuery,
    OccurrenceSearchQueryVariables
  >(OCCURRENCE_SEARCH_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        predicate: {
          ...query,
        },
        size: PAGE_SIZE,
        from: from,
      },
    });
  }, [load, filterHash, searchContext, from]);

  const columns = useColumns({ showPreview: setPreviewKey, filters });

  const occurrences = React.useMemo(
    () => data?.occurrenceSearch?.documents.results.filter(notNull) ?? [],
    [data]
  );

  const totalResults = React.useMemo(() => data?.occurrenceSearch?.documents.total, [data]);

  const currentPageNumber = data?.occurrenceSearch?.documents.from
    ? Math.floor(data.occurrenceSearch.documents.from / PAGE_SIZE)
    : 0;
  const totalPagesCount = data?.occurrenceSearch?.documents.total
    ? Math.ceil(data.occurrenceSearch.documents.total / PAGE_SIZE)
    : 0;

  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>

      <Drawer
        isOpen={typeof previewKey === 'string'}
        close={() => setPreviewKey(null)}
        viewOnGbifHref={`/occurrence/${previewKey}`}
        next={() => {
          const currentIndex = occurrences.findIndex((o) => o.key?.toString() === previewKey);
          const nextIndex = currentIndex + 1;
          if (nextIndex < occurrences.length) {
            setPreviewKey(occurrences[nextIndex].key?.toString());
          }
        }}
        previous={() => {
          const currentIndex = occurrences.findIndex((o) => o.key?.toString() === previewKey);
          const previousIndex = currentIndex - 1;
          if (previousIndex >= 0) {
            setPreviewKey(occurrences[previousIndex].key?.toString());
          }
        }}
      >
        <StandaloneOccurrenceKeyPage occurrenceKey={previewKey} />
      </Drawer>

      <DataHeader
        title="Occurrences"
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      >
        {/* Our tabs component is very tied into a specific way to handle routes an actions. 
        It would be nice to split it up into a more generic component that can be used in more contexts.
        Could be this where we do search params or it could be links to other sites 
        For now a quick and dirty mock to have the option to do views with a url search param
        */}
        <div className="g-relative g-border-slate-200 dark:g-border-slate-200/5">
          <ul className="g-flex g-whitespace-nowrap g-overflow-hidden -g-mb-px">
            <li role="button" className={cn("g-p-2 g-border-b-2 g-border-transparent", view === 'table' && 'g-border-b-primary-500')} onClick={() => setView('table')}>Table</li>
            <li role="button" className={cn("g-p-2 g-border-b-2 g-border-transparent", view === 'map' && 'g-border-b-primary-500')} onClick={() => setView('map')}>Map</li>
            <li role="button" className={cn("g-p-2 g-border-b-2 g-border-transparent", view === 'media' && 'g-border-b-primary-500')} onClick={() => setView('media')}>Media</li>
            <li role="button" className={cn("g-p-2 g-border-b-2 g-border-transparent", view === 'clusters' && 'g-border-b-primary-500')} onClick={() => setView('clusters')}>Related</li>
            <li role="button" className={cn("g-p-2 g-border-b-2 g-border-transparent", view === 'dashboard' && 'g-border-b-primary-500')} onClick={() => setView('dashboard')}>Dashboard</li>
            <li role="button" className={cn("g-p-2 g-border-b-2 g-border-transparent", view === 'download' && 'g-border-b-primary-500')} onClick={() => setView('download')}>Download</li>
          </ul>
        </div>
      </DataHeader>

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
      </section>

      {view === 'table' && <InternalScrollHandler headerHeight={200}>
        <div className="g-bg-gray-100 g-p-2 g-flex g-flex-col g-flex-1 g-min-h-0">
          <p className="g-text-sm g-pb-1 g-text-gray-500">
            {typeof totalResults === 'number' && <>{totalResults} results</>}
          </p>
          <DataTable
            className="g-bg-white g-flex-1 g-min-h-0"
            columns={columns}
            data={occurrences}
            loading={loading}
            pageSize={PAGE_SIZE}
            currentPageNumber={currentPageNumber}
            totalPagesCount={totalPagesCount}
          />
        </div>
      </InternalScrollHandler>}

      {view === 'map' && <Map />}
      {view === 'media' && <Media />}
      {view === 'clusters' && <Clusters />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'download' && <Download />}
    </>
  );
}
