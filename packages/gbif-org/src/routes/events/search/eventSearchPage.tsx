import { DataHeader } from '@/components/dataHeader';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FilterBar, FilterButtons } from '@/components/filters/filterTools';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useStringParam } from '@/hooks/useParam';
import { useUpdateViewParams } from '@/hooks/useUpdateViewParams';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdDeleteOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './help';
import { searchConfig } from './searchConfig';
import EntityDrawer from './views/browseList/ListBrowser';
import { EventTable } from './views/table/eventTable';

export function EventSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset', 'from'],
    defaultChecklistKey: undefined,
  });
  const config = useConfig();

  return (
    <>
      <FormattedMessage id="event.pageTitle" defaultMessage="Event search">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>

      <SearchContextProvider searchContext={config.eventSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <EventSearchPageInner />
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

export function EventSearchPageInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const defaultView = searchContext.defaultTab ?? searchContext?.tabs?.[0] ?? 'table';
  const currentFilterContext = useContext(FilterContext);
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
        title={<FormattedMessage id="catalogues.events" defaultMessage="Events" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      >
        <EventViewTabs
          view={view}
          defaultView={defaultView}
          tabs={searchContext.tabs}
          className="g-border-none"
        />
      </DataHeader>

      <section>
        <FilterBar className="g-flex f-flex-nowrap g-items-start">
          <div>
            <FilterButtons filters={filters} searchContext={searchContext} groups={groups} />
          </div>
          <div className="g-flex-1"></div>
          <div className="g-flex g-items-center g-gap-1 g-ps-2">
            <Button
              size="sm"
              variant="ghost"
              className="g-px-1 g-mb-1 g-text-slate-400 hover:g-text-red-800"
              onClick={() => currentFilterContext.setFilter({})}
            >
              <MdDeleteOutline className="g-text-base" />
            </Button>
          </div>
        </FilterBar>
      </section>

      <Views view={view} className="g-py-2 g-px-4 g-bg-slate-100" />
    </>
  );
}

export function EventSearchInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const defaultView = searchContext?.tabs?.[0] ?? 'table';
  const [view] = useStringParam({
    key: 'view',
    defaultValue: defaultView,
    hideDefault: true,
  });

  return (
    <ErrorBoundary showStackTrace showReportButton>
      <EntityDrawer />
      <section className="g-bg-white">
        <Card>
          <EventViewTabs
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
    </ErrorBoundary>
  );
}

function Views({ view: unknownCaseView, className }: { view?: string; className?: string }) {
  // lower case view to match the tabs
  const view = unknownCaseView?.toLowerCase();
  const fixedHeight = ['table'].includes(view ?? '');
  return (
    <ErrorBoundary invalidateOn={view}>
      <div className={className}>
        {fixedHeight && (
          <DynamicHeightDiv minPxHeight={500}>
            {view === 'table' && <EventTable />}
          </DynamicHeightDiv>
        )}
      </div>
    </ErrorBoundary>
  );
}

function EventViewTabs({
  view,
  defaultView,
  tabs = ['table'],
  className,
}: {
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
