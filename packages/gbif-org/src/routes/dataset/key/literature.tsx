import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { LiteratureSearchInner } from '@/routes/literature/search/literatureSearch';
import { searchConfig } from '@/routes/literature/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useEffect, useState } from 'react';
import { DatasetKeyContext } from './datasetKey';

export function DatasetKeyLiterature() {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();
  const { datasetKey } = useContext(DatasetKeyContext);
  const literatureSearchConfig = baseConfig?.datasetKey?.literatureSearch;

  useEffect(() => {
    if (!datasetKey) return;

    const c = {
      ...baseConfig.literatureSearch,
      ...literatureSearchConfig,
      scope: {
        type: 'equals',
        key: 'gbifDatasetKey',
        value: datasetKey,
      },
    };
    setConfig(c);
  }, [baseConfig, datasetKey, literatureSearchConfig]);

  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {config && (
          <SearchContextProvider searchContext={config}>
            <FilterProvider filter={filter} onChange={setFilter}>
              <LiteratureSearchInner />
            </FilterProvider>
          </SearchContextProvider>
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

//function to remove a specific string from an array
function removeStringFromArray(array: string[], string: string): string[] {
  return array.filter((item) => item !== string);
}
