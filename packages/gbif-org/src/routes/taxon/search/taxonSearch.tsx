import { DataHeader } from '@/components/dataHeader';
import { FilterBar, FilterButtons } from '@/components/filters/filterTools';
import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useStringParam } from '@/hooks/useParam';
import { cn } from '@/utils/shadcn';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useFilters } from './filters';
import { searchConfig } from './searchConfig';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { Card } from '@/components/ui/smallCard';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useUpdateViewParams } from '@/hooks/useUpdateViewParams';
import { AboutContent, ApiContent } from './helpTexts';
import EntityDrawer from '@/routes/occurrence/search/views/browseList/ListBrowser';
import { Table } from './views/table';
import { Tree } from './views/tree';

export function TaxonSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset', 'from'],
  });
  const config = useConfig();

  return (
    <>
      <Helmet>
        <title>Taxon search</title>
      </Helmet>
      <SearchContextProvider searchContext={config.taxonSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <TaxonSearchPageInner />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function TaxonSearchPageInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const defaultView = searchContext?.tabs?.[0] ?? 'table';
  const [view, setView] = useStringParam({
    key: 'view',
    defaultValue: defaultView,
    hideDefault: true,
  });

  return (
    <>
      <EntityDrawer />
      <DataHeader
        title="Taxons"
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      >
        {/* Our tabs component is very tied into a specific way to handle routes an actions. 
        It would be nice to split it up into a more generic component that can be used in more contexts.
        Could be this where we do search params or it could be links to other sites 
        For now a quick and dirty mock to have the option to do views with a url search param
        */}
        <TaxonViewTabs
          setView={setView}
          view={view}
          defaultView={defaultView}
          tabs={searchContext.tabs}
        />
      </DataHeader>

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
      </section>

      <Views view={view} className="g-py-2 g-px-4 g-bg-slate-100" />
    </>
  );
}

export function TaxonSearchInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const defaultView = searchContext?.tabs?.[0] ?? 'table';
  const [view, setView] = useStringParam({
    key: 'view',
    defaultValue: defaultView,
    hideDefault: true,
  });

  return (
    <>
      <EntityDrawer />
      <section className="g-bg-white">
        <Card>
          <TaxonViewTabs
            setView={setView}
            view={view}
            defaultView={defaultView}
            tabs={searchContext.tabs}
            className="g-border-b"
          />
          <FilterBar>
            <FilterButtons filters={filters} searchContext={searchContext} />
          </FilterBar>
        </Card>
      </section>

      <Views view={view} className="g-py-2" />
    </>
  );
}

function Views({ view, className }: { view?: string; className?: string }) {
  const fixedHeight = ['table'].includes(view ?? '');
  return (
    <ErrorBoundary invalidateOn={view}>
      <div className={cn('', className)}>
        {fixedHeight && (
          <DynamicHeightDiv minPxHeight={500}>
            {view === 'table' && <Table />}
          </DynamicHeightDiv>
        )}
        {!fixedHeight && (
          <DynamicHeightDiv minPxHeight={500} onlySetMinHeight>
            {view === 'media' && <Tree />}
          </DynamicHeightDiv>
        )}
      </div>
    </ErrorBoundary>
  );
}

// temporary view selector until we have a proper tabs implementation
function TaxonViewTabs({
  view,
  defaultView,
  tabs = ['table', 'tree'],
  className,
}: {
  setView: (view: string) => void;
  defaultView?: string;
  view?: string;
  tabs?: string[];
  className?: string;
}) {
  const { getParams } = useUpdateViewParams(['from', 'sort', 'limit', 'offset']); // Removes 'from' and 'sort'

  return (
    <div className={cn('g-relative g-border-slate-200 dark:g-border-slate-200/5', className)}>
      <ul className="g-flex g-whitespace-nowrap g-overflow-hidden -g-mb-px">
        {tabs.map((tab) => {
          return (
            <li
              key={tab}
              role="button"
              className={cn(
                'g-p-2 g-border-b-2 g-border-transparent',
                view === tab && 'g-border-b-primary-500'
              )}
            >
              <Link to={{ search: getParams(tab, defaultView).toString() }}>
                <FormattedMessage id={`search.tabs.${tab}`} defaultMessage={tab} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}