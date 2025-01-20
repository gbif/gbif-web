import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { OccurrenceSearchInner } from '@/routes/occurrence/search/occurrenceSearchPage';
import { searchConfig } from '@/routes/occurrence/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useEffect, useState } from 'react';
import { DatasetKeyContext } from './datasetKey';

export function DatasetKeyOccurrences() {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();
  const { datasetKey, contentMetrics } = useContext(DatasetKeyContext);
  const occurrenceSearchConfig = baseConfig?.datasetKey?.occurrenceSearch;

  useEffect(() => {
    if (!datasetKey) return;
    let activeTabs = occurrenceSearchConfig?.tabs ?? [
      'table',
      'map',
      'gallery',
      'clusters',
      'download',
    ];
    if (contentMetrics?.withCoordinates?.documents?.total === 0)
      activeTabs = removeStringFromArray(activeTabs, 'map');
    if (contentMetrics?.withImages?.documents?.total === 0)
      activeTabs = removeStringFromArray(activeTabs, 'gallery');
    if (contentMetrics?.withClusters?.documents?.total === 0)
      activeTabs = removeStringFromArray(activeTabs, 'clusters');
    if (!activeTabs.includes('table'))
      // if there is no table, then add it as the first tab
      activeTabs.unshift('table');

    const c = {
      ...baseConfig.occurrenceSearch,
      ...occurrenceSearchConfig,
      tabs: activeTabs,
      scope: {
        type: 'equals',
        key: 'datasetKey',
        value: datasetKey,
      },
    };
    setConfig(c);
  }, [baseConfig, contentMetrics, datasetKey, occurrenceSearchConfig]);

  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {config && (
          <SearchContextProvider searchContext={config}>
            <FilterProvider filter={filter} onChange={setFilter}>
              <OccurrenceSearchInner />
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
