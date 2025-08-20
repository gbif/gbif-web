import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import React from 'react';
import { searchConfig } from '../literature/search/searchConfig';
import { LiteratureTable } from './literatureTable';

export function LiteratureSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['from'],
  });
  const config = useConfig();
  return (
    <>
      <SearchContextProvider searchContext={config.literatureSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <ErrorBoundary>
            <div className="g-py-2 g-px-4 g-bg-slate-100">
              <DynamicHeightDiv minPxHeight={500}>
                <LiteratureTable />
              </DynamicHeightDiv>
            </div>
          </ErrorBoundary>
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}
