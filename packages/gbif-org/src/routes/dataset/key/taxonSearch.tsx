import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { searchConfig } from '@/routes/taxon/search/searchConfig';
import { useEffect, useState } from 'react';
import { TaxonSearchInner } from '../../taxon/search/taxonSearch';
import EmptyTab from '@/components/EmptyTab';
import { useDatasetKeyContext } from './datasetKey';

const NoneEmptyTab = () => {
  const { datasetKey } = useDatasetKeyContext();
  const config = useConfig();
  const [searchContext, setSearchContext] = useState({
    ...config.taxonSearch,
    scope: { datasetKey: datasetKey },
  });
  useEffect(() => {
    setSearchContext({
      ...config.taxonSearch,
      scope: { datasetKey: datasetKey },
    });
  }, [config?.taxonSearch, datasetKey]);

  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset', 'from'],
  });
  return (
    <SearchContextProvider searchContext={searchContext}>
      <FilterProvider filter={filter} onChange={setFilter}>
        <ArticleContainer className="g-bg-slate-100">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <TaxonSearchInner datasetKey={datasetKey} />
          </ArticleTextContainer>
        </ArticleContainer>
      </FilterProvider>
    </SearchContextProvider>
  );
};

export const DatasetKeyTaxonSearch = () => {
  const { showSpeciesTab } = useDatasetKeyContext();
  if (showSpeciesTab) return <NoneEmptyTab />;
  return <EmptyTab />;
};
