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

export function LiteratureSearch(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });

  return (
    <>
      <DataHeader
        title={<FormattedMessage id="catalogues.literature" defaultMessage="Literature" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      ></DataHeader>

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
      </section>

      <ErrorBoundary>
        <div className="g-py-2 g-px-4 g-bg-slate-100">
          <DynamicHeightDiv minPxHeight={500}>
            <LiteratureTable />
          </DynamicHeightDiv>
        </div>
      </ErrorBoundary>
    </>
  );
}
