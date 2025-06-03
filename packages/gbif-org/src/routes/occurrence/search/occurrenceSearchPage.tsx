import { DataHeader } from '@/components/dataHeader';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DatasetLabel } from '@/components/filters/displayNames';
import { FilterBar, FilterButtons } from '@/components/filters/filterTools';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Card } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useStringParam } from '@/hooks/useParam';
import { useUpdateViewParams } from '@/hooks/useUpdateViewParams';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdDeleteOutline, MdInfo } from 'react-icons/md';
import { PiGitBranchBold as TaxonomyIcon } from 'react-icons/pi';
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
  const siteConfig = useConfig();
  const { filters } = useFilters({ searchConfig });
  const defaultView = searchContext.defaultTab ?? searchContext?.tabs?.[0] ?? 'table';
  const currentFilterContext = useContext(FilterContext);
  const [view] = useStringParam({
    key: 'view',
    defaultValue: defaultView,
    hideDefault: true,
  });

  const availableChecklistKeys = siteConfig.availableChecklistKeys ?? [];

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
        <OccurrenceViewTabs
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
            {availableChecklistKeys.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant={
                      currentFilterContext.filter.checklistKey !== siteConfig.defaultChecklistKey
                        ? 'default'
                        : 'ghost'
                    }
                    className="g-px-1 g-mb-1 g-text-slate-400"
                  >
                    <TaxonomyIcon className="g-text-base" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    Supported checklists
                    <a href={`/checklists`} className="g-ms-2">
                      <MdInfo />
                    </a>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={
                      currentFilterContext.filter.checklistKey ?? siteConfig.defaultChecklistKey
                    }
                    onValueChange={(value) => currentFilterContext.setChecklistKey(value)}
                  >
                    {availableChecklistKeys.map((key) => (
                      <DropdownMenuRadioItem
                        key={key}
                        value={key}
                        className="g-text-sm g-text-slate-700"
                      >
                        <DatasetLabel id={key} />
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
    <ErrorBoundary showStackTrace showReportButton>
      <EntityDrawer />
      <section className="g-bg-white">
        <Card>
          <OccurrenceViewTabs
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
