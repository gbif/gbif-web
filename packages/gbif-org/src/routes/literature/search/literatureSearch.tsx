import { DataHeader } from '@/components/dataHeader';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FilterBar, FilterButtons } from '@/components/filters/filterTools';
import { Tabs } from '@/components/tabs';
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
import { LiteratureListView } from './views/list';
import { LiteratureTable } from './views/table';

export function LiteratureSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const config = useConfig();
  return (
    <>
      <FormattedMessage id="catalogues.literature" defaultMessage="Literature">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>

      <SearchContextProvider searchContext={config.literatureSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <LiteratureSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

const defaultTabs = ['table', 'list'];

export function LiteratureSearch(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const config = useConfig();
  const defaultView = config.literatureSearch?.defaultTab ?? 'table';
  const [view] = useStringParam({
    key: 'view',
    defaultValue: defaultView,
    hideDefault: true,
  });

  return (
    <>
      <DataHeader
        title={<FormattedMessage id="catalogues.literature" defaultMessage="Literature" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      >
        <LiteartureViewTabs
          tabs={config.literatureSearch?.tabs ?? defaultTabs}
          view={view}
          defaultView={defaultView}
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

function Views({ view, className }: { view?: string; className?: string }) {
  const fixedHeight = ['table'].includes(view ?? '');

  return (
    <ErrorBoundary invalidateOn={view}>
      <div className={className}>
        {fixedHeight && (
          <DynamicHeightDiv minPxHeight={500}>
            {view === 'table' && <LiteratureTable />}
          </DynamicHeightDiv>
        )}
        {!fixedHeight && (
          <DynamicHeightDiv minPxHeight={500} onlySetMinHeight>
            {view === 'list' && <LiteratureListView />}
          </DynamicHeightDiv>
        )}
      </div>
    </ErrorBoundary>
  );
}

function LiteartureViewTabs({
  view,
  defaultView,
  tabs = ['table', 'list'],
}: {
  view?: string;
  defaultView?: string;
  tabs?: string[];
}) {
  const { getParams } = useUpdateViewParams(['from', 'sort', 'limit', 'offset']); // Removes 'from' and 'sort'

  return (
    <Tabs
      className="g-border-none"
      disableAutoDetectActive
      links={tabs.map((tab) => ({
        isActive: view === tab,
        to: { search: getParams(tab, defaultView).toString() },
        children: <FormattedMessage id={`search.tabs.${tab}`} defaultMessage={tab} />,
      }))}
    />
  );
}
