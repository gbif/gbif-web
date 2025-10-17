import { DataHeader } from '@/components/dataHeader';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FilterBar, FilterButtons } from '@/components/filters/filterTools';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './help';
import { searchConfig } from './searchConfig';
import { LiteratureTable } from './views/table';
import { Button } from '@/components/ui/button';
import { MdDeleteOutline } from 'react-icons/md';
import { MobileFilters } from '@/components/filters/mobileFilters';

export function LiteratureSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['from'],
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
          <LiteraturePageSearchInner />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function LiteraturePageSearchInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const filterContext = useContext(FilterContext);

  return (
    <>
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.literature" defaultMessage="Literature" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
        hideIfNoCatalogue={true}
      />

      <section>
        <FilterBar className="g-flex f-flex-nowrap g-items-start g-gap-2">
          <div className="g-hidden sm:g-block">
            <FilterButtons filters={filters} searchContext={searchContext} />
          </div>
          <div className="g-flex g-items-center g-gap-1 g-flex-1 g-justify-end">
            <MobileFilters className="sm:g-hidden" filters={filters} />
            <Button
              size="sm"
              variant="ghost"
              className="g-px-1 g-mb-1 g-text-slate-400 hover:g-text-red-800"
              onClick={() => filterContext?.setFilter({})}
            >
              <MdDeleteOutline className="g-text-base" />
            </Button>
          </div>
        </FilterBar>

        <ErrorBoundary>
          <div className="g-py-2 g-px-4 g-bg-slate-100">
            <DynamicHeightDiv minPxHeight={500}>
              <LiteratureTable />
            </DynamicHeightDiv>
          </div>
        </ErrorBoundary>
      </section>
    </>
  );
}

export function LiteratureSearchInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const filterContext = useContext(FilterContext);

  return (
    <ErrorBoundary>
      <FilterBar className="g-flex f-flex-nowrap g-items-start g-gap-2">
        <div className="g-hidden sm:g-block">
          <FilterButtons filters={filters} searchContext={searchContext} />
        </div>
        <div className="g-flex g-items-center g-gap-1 g-flex-1 g-justify-end">
          <MobileFilters className="sm:g-hidden" filters={filters} />
          <Button
            size="sm"
            variant="ghost"
            className="g-px-1 g-mb-1 g-text-slate-400 hover:g-text-red-800"
            onClick={() => filterContext?.setFilter({})}
          >
            <MdDeleteOutline className="g-text-base" />
          </Button>
        </div>
      </FilterBar>

      <ErrorBoundary>
        <div className="g-py-2">
          <DynamicHeightDiv minPxHeight={500}>
            <LiteratureTable />
          </DynamicHeightDiv>
        </div>
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
