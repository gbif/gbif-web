import { DataHeader } from '@/components/dataHeader';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FilterBarWithActions } from '@/components/filters/filterBarWithActions';
import { Tabs } from '@/components/tabs';
import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useStringParam } from '@/hooks/useParam';
import { useUpdateViewParams } from '@/hooks/useUpdateViewParams';
import EntityDrawer from '@/routes/occurrence/search/views/browseList/ListBrowser';
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './helpTexts';
import { searchConfig } from './searchConfig';
import { Table } from './views/table';
import { TaxonTree } from './views/tree';

export function TaxonSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset', 'from'],
  });
  const config = useConfig();

  return (
    <>
      <FormattedMessage id="catalogues.species" defaultMessage="Taxon">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>

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

  const visibleFilters = useMemo(() => {
    if (view === 'table') {
      return filters;
    } else if (view === 'tree') {
      return { higherTaxonKey: filters.higherTaxonKey };
    } else if (filters.q) {
      return { q: filters.q };
    } else {
      return {};
    }
  }, [filters, view]);

  return (
    <>
      <EntityDrawer />
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.species" defaultMessage="Taxon" />}
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

      <section>
        <FilterBarWithActions filters={visibleFilters} />
      </section>

      <Views view={view} entityDrawerPrefix="t" className="g-py-2 g-px-4 g-bg-slate-100" />
    </>
  );
}

/* export function TaxonSearchInner(): React.ReactElement {
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
} */

export function Views({
  view,
  className,
  entityDrawerPrefix,
}: {
  view?: string;
  className?: string;
  entityDrawerPrefix: string;
}) {
  const fixedHeight = ['table'].includes(view ?? '');
  return (
    <ErrorBoundary invalidateOn={view}>
      <div className={className}>
        {fixedHeight && (
          <DynamicHeightDiv minPxHeight={500}>
            {view === 'table' && <Table entityDrawerPrefix={entityDrawerPrefix} />}
          </DynamicHeightDiv>
        )}
        {!fixedHeight && (
          <DynamicHeightDiv
            minPxHeight={500}
            onlySetMinHeight
            className="g-bg-white g-flex-1 g-border g-border-solid g-basis-full g-h-1 g-flex g-flex-col"
          >
            {view === 'tree' && <TaxonTree entityDrawerPrefix={entityDrawerPrefix} />}
          </DynamicHeightDiv>
        )}
      </div>
    </ErrorBoundary>
  );
}

export function TaxonViewTabs({
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
    <Tabs
      disableAutoDetectActive
      className={className}
      links={tabs.map((tab) => ({
        isActive: view === tab,
        to: { search: getParams(tab, defaultView).toString() },
        children: <FormattedMessage id={`search.tabs.${tab}`} defaultMessage={tab} />,
      }))}
    />
  );
}
