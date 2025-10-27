import { DataHeader } from '@/components/dataHeader';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ChecklistSelector } from '@/components/filters/checklistSelector';
import { FilterBarWithActions } from '@/components/filters/filterBarWithActions';
import { Tabs } from '@/components/tabs';
import { Card } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useStringParam } from '@/hooks/useParam';
import { useUpdateViewParams } from '@/hooks/useUpdateViewParams';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './help';
import { searchConfig } from './searchConfig';
import EntityDrawer from './views/browseList/ListBrowser';
import { Clusters } from './views/clusters';
import { Dashboard } from './views/dashboard';
import { Dataset } from './views/datasets';
import { Download } from './views/download';
import { Map } from './views/map';
import { Media } from './views/media';
import { OccurrenceTable } from './views/table/occurrenceTable';

export function OccurrenceSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset', 'from'],
    defaultChecklistKey: useConfig().defaultChecklistKey,
  });
  const config = useConfig();

  return (
    <>
      <FormattedMessage id="occurrence.pageTitle" defaultMessage="Occurrence search">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>

      <SearchContextProvider searchContext={config.occurrenceSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <OccurrenceSearchPageInner />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

const groups = [
  'record',
  'occurrence',
  'organism',
  'materialEntity',
  'event',
  'location',
  'geologicalContext',
  'identification',
  'taxon',
  'provenance',
  'other',
];

export function OccurrenceSearchPageInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const defaultView = searchContext.defaultTab ?? searchContext?.tabs?.[0] ?? 'table';
  const [view] = useStringParam({
    key: 'view',
    defaultValue: defaultView,
    hideDefault: true,
  });

  return (
    <>
      <EntityDrawer />
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.occurrences" defaultMessage="Occurrences" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      >
        <OccurrenceViewTabs view={view} defaultView={defaultView} tabs={searchContext.tabs} />
      </DataHeader>

      <section>
        <FilterBarWithActions
          filters={filters}
          groups={groups}
          additionalActions={<ChecklistSelector />}
        />
      </section>

      <Views view={view} className="g-py-2 g-px-4 g-bg-slate-100" />
    </>
  );
}

export function OccurrenceSearchInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const defaultView = searchContext?.tabs?.[0] ?? 'table';
  const [view] = useStringParam({
    key: 'view',
    defaultValue: defaultView,
    hideDefault: true,
  });

  return (
    <ErrorBoundary showReportButton>
      <EntityDrawer />
      <section className="g-bg-white">
        <Card>
          <OccurrenceViewTabs
            view={view}
            defaultView={defaultView}
            tabs={searchContext.tabs}
            className="g-border-b"
          />
          <FilterBarWithActions filters={filters} groups={groups} />
        </Card>
      </section>

      <Views view={view} className="g-py-2" />
    </ErrorBoundary>
  );
}

function Views({ view: unknownCaseView, className }: { view?: string; className?: string }) {
  // lower case view to match the tabs
  const view = unknownCaseView?.toLowerCase();
  const fixedHeight = ['table', 'map', 'clusters'].includes(view ?? '');
  return (
    <ErrorBoundary invalidateOn={view}>
      <div className={className}>
        {fixedHeight && (
          <DynamicHeightDiv minPxHeight={500}>
            {view === 'table' && <OccurrenceTable />}
            {view === 'map' && <Map />}
            {view === 'clusters' && <Clusters />}
          </DynamicHeightDiv>
        )}
        {!fixedHeight && (
          <DynamicHeightDiv minPxHeight={500} onlySetMinHeight>
            {view === 'gallery' && <Media />}
            {view === 'datasets' && <Dataset />}
            {view === 'download' && <Download />}
            {view === 'dashboard' && <Dashboard />}
          </DynamicHeightDiv>
        )}
      </div>
    </ErrorBoundary>
  );
}

function OccurrenceViewTabs({
  view,
  defaultView,
  tabs = ['table', 'map', 'gallery', 'clusters', 'datasets', 'dashboard', 'download'],
}: {
  defaultView?: string;
  view?: string;
  tabs?: string[];
}) {
  const { getParams } = useUpdateViewParams(['from', 'sort', 'limit', 'offset']); // Removes 'from' and 'sort'

  return (
    <Tabs
      disableAutoDetectActive
      className="g-border-none"
      links={tabs.map((tab) => ({
        isActive: view === tab,
        to: { search: getParams(tab, defaultView).toString() },
        children: <FormattedMessage id={`search.tabs.${tab}`} defaultMessage={tab} />,
      }))}
    />
  );
}
