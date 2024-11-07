import { DataHeader } from '@/components/dataHeader';
import { Drawer } from '@/components/drawer/drawer';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { InternalScrollHandler } from '@/components/internalScrollHandler';
import { SearchTable } from '@/components/searchTable/table';
import { usePaginationState } from '@/components/searchTable/usePaginationState';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import { useStringParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { useOccurrenceColumns } from '@/routes/occurrence/search/columns';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { cn } from '@/utils/shadcn';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { StandaloneOccurrenceKeyPage } from '../key/standalone';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './helpTexts';
import { Map } from './views/map';
import { Media } from './views/media';
import { searchConfig } from './searchConfig';
import { Clusters } from './views/clusters';
import { Dashboard } from './views/dashboard';
import { Download } from './views/download';
import EntityDrawer from './views/browseList/ListBrowser';

// TODO: Should maybe be moved to the configBuilder
const DAFAULT_AVAILABLE_TABLE_COLUMNS = Object.freeze([
  'country',
  'coordinates',
  'year',
  'basisOfRecord',
  'dataset',
  'publisher',
]);
const DEFAULT_ENABLED_TABLE_COLUMNS = Object.freeze([...DAFAULT_AVAILABLE_TABLE_COLUMNS]);

const OCCURRENCE_SEARCH_QUERY = /* GraphQL */ `
  query OccurrenceSearch($from: Int, $size: Int, $predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          key
          taxonKey
          scientificName
          eventDate
          coordinates
          country
          countryCode
          basisOfRecord
          datasetTitle
          datasetKey
          publisherTitle
        }
      }
    }
  }
`;

export type SingleOccurrenceSearchResult = ExtractPaginatedResult<
  OccurrenceSearchQuery['occurrenceSearch']
>;

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
  const previewInDrawer = true;
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [view, setView] = useStringParam({ key: 'view', defaultValue: 'table', hideDefault: true });
  const config = useConfig();

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const [previewKey, setPreviewKey] = useState<string | null>();
  const [paginationState, setPaginationState] = usePaginationState();

  const { data, load, loading } = useQuery<OccurrenceSearchQuery, OccurrenceSearchQueryVariables>(
    OCCURRENCE_SEARCH_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        predicate: {
          ...query,
        },
        size: paginationState.pageSize,
        from: paginationState.pageIndex * paginationState.pageSize,
      },
    });
  }, [load, filterHash, searchContext, paginationState.pageIndex, paginationState.pageSize]);

  const columns = useOccurrenceColumns({ showPreview: setPreviewKey, filters });

  const occurrences = React.useMemo(
    () => data?.occurrenceSearch?.documents.results.filter(notNull) ?? [],
    [data]
  );

  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>

      <EntityDrawer />

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
            <li
              role="button"
              className={cn(
                'g-p-2 g-border-b-2 g-border-transparent',
                view === 'table' && 'g-border-b-primary-500'
              )}
              onClick={() => setView('table')}
            >
              Table
            </li>
            <li
              role="button"
              className={cn(
                'g-p-2 g-border-b-2 g-border-transparent',
                view === 'map' && 'g-border-b-primary-500'
              )}
              onClick={() => setView('map')}
            >
              Map
            </li>
            <li
              role="button"
              className={cn(
                'g-p-2 g-border-b-2 g-border-transparent',
                view === 'media' && 'g-border-b-primary-500'
              )}
              onClick={() => setView('media')}
            >
              Media
            </li>
            <li
              role="button"
              className={cn(
                'g-p-2 g-border-b-2 g-border-transparent',
                view === 'clusters' && 'g-border-b-primary-500'
              )}
              onClick={() => setView('clusters')}
            >
              Related
            </li>
            <li
              role="button"
              className={cn(
                'g-p-2 g-border-b-2 g-border-transparent',
                view === 'dashboard' && 'g-border-b-primary-500'
              )}
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </li>
            <li
              role="button"
              className={cn(
                'g-p-2 g-border-b-2 g-border-transparent',
                view === 'download' && 'g-border-b-primary-500'
              )}
              onClick={() => setView('download')}
            >
              Download
            </li>
          </ul>
        </div>
      </DataHeader>

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
      </section>

      {view === 'table' && (
        <h1>table placeholder</h1>
        // <InternalScrollHandler headerHeight={150}>
        //   <SearchTable
        //     className="g-bg-white g-flex-1 g-min-h-0"
        //     columns={columns}
        //     data={occurrences}
        //     loading={loading}
        //     rowCount={data?.occurrenceSearch?.documents.total}
        //     pagination={paginationState}
        //     setPaginationState={setPaginationState}
        //     // TODO: Should the logic be located in the config?
        //     availableTableColumns={[
        //       'scientificName',
        //       ...(config?.occurrenceSearch?.availableTableColumns ??
        //         DAFAULT_AVAILABLE_TABLE_COLUMNS),
        //     ]}
        //     defaultEnabledTableColumns={[
        //       'scientificName',
        //       ...(config?.occurrenceSearch?.defaultEnabledTableColumns ??
        //         DEFAULT_ENABLED_TABLE_COLUMNS),
        //     ]}
        //   />
        // </InternalScrollHandler>
      )}

      {view === 'map' && <Map />}
      {view === 'media' && <Media />}
      {view === 'clusters' && <Clusters />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'download' && <Download />}
    </>
  );
}
