import { DataHeader, useIsDataHeaderVisible } from '@/components/dataHeader';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FilterBarWithActions } from '@/components/filters/filterBarWithActions';
import { MobileFiltersTrigger, useIsMobileFilterSheetActive } from '@/components/filters/mobileFilters';
import { useConfig } from '@/config/config';
import { cn } from '@/utils/shadcn';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './help';
import { searchConfig } from './searchConfig';
import { LiteratureTable } from './views/table';
import PageMetaData from '@/components/PageMetaData';

export function LiteratureSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['from'],
  });
  const config = useConfig();
  const intl = useIntl();

  return (
    <>
      <PageMetaData
        path="/literature/search"
        title={intl.formatMessage({ id: 'literatureSearch.title' })}
        description={intl.formatMessage({ id: 'literatureSearch.description' })}
      />

      <SearchContextProvider searchContext={config.literatureSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <LiteraturePageSearchInner />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function LiteraturePageSearchInner(): React.ReactElement {
  const { filters } = useFilters({ searchConfig });
  const dataHeaderVisible = useIsDataHeaderVisible({ hideIfNoCatalogue: true });
  const filterSheetActive = useIsMobileFilterSheetActive(filters);
  const hideBarOnMobile = dataHeaderVisible && filterSheetActive;

  return (
    <>
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.literature" defaultMessage="Literature" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
        hideIfNoCatalogue={true}
        mobileFiltersTrigger={<MobileFiltersTrigger filters={filters} />}
      />

      <section>
        <div
          className={cn(
            'g-bg-white g-border-b g-border-slate-200',
            hideBarOnMobile && 'g-hidden sm:g-block'
          )}
        >
          <FilterBarWithActions
            filters={filters}
            className="g-px-4"
            hideMobileFilters={dataHeaderVisible}
          />
        </div>

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
  const { filters } = useFilters({ searchConfig });

  return (
    <ErrorBoundary>
      <FilterBarWithActions filters={filters} />

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
