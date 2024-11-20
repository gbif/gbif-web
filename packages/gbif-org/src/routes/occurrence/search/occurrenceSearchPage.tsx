import { DataHeader } from '@/components/dataHeader';
import { FilterBar, FilterButtons } from '@/components/filters/filterTools';
import { InternalScrollHandler } from '@/components/internalScrollHandler';
import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useStringParam } from '@/hooks/useParam';
import { cn } from '@/utils/shadcn';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './helpTexts';
import { searchConfig } from './searchConfig';
import EntityDrawer from './views/browseList/ListBrowser';
import { Clusters } from './views/clusters';
import { Dashboard } from './views/dashboard';
import { Download } from './views/download';
import { Map } from './views/map';
import { Media } from './views/media';
import { OccurrenceTable } from './views/table';
import { Dataset } from './views/datasets';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';

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
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [view, setView] = useStringParam({ key: 'view', defaultValue: 'table', hideDefault: true });

  const fixedHeight = ['table', 'map', 'clusters'].includes(view);
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
                view === 'dataset' && 'g-border-b-primary-500'
              )}
              onClick={() => setView('dataset')}
            >
              Datasets
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

      <ErrorBoundary invalidateOn={view}>
        <div className="g-py-2 g-px-4 g-bg-slate-100">
          {fixedHeight && (
            <DynamicHeightDiv minPxHeight={500}>
              {view === 'table' && <OccurrenceTable />}
              {view === 'map' && <Map />}
              {view === 'clusters' && <Clusters />}
            </DynamicHeightDiv>
          )}
          {!fixedHeight && (
            <DynamicHeightDiv minPxHeight={500} onlySetMinHeight>
              {view === 'media' && <Media />}
              {view === 'dataset' && <Dataset />}
              {view === 'download' && <Download />}
              {view === 'dashboard' && <Dashboard />}
            </DynamicHeightDiv>
          )}
        </div>
      </ErrorBoundary>
    </>
  );
}
