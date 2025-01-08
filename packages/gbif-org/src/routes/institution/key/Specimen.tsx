import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { OccurrenceSearchInner } from '@/routes/occurrence/search/occurrenceSearchPage';
import { searchConfig } from '@/routes/occurrence/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useEffect, useState } from 'react';
import { InstitutionKeyContext } from './institutionKeyPresentation';

export default function Specimen() {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();
  const { key, contentMetrics } = useContext(InstitutionKeyContext);
  const occurrenceSearchConfig = baseConfig?.institutionKey?.occurrenceSearch;

  useEffect(() => {
    let activeTabs = occurrenceSearchConfig?.tabs ?? [];
    if (contentMetrics?.withCoordinates?.documents?.total === 0)
      activeTabs = removeStringFromArray(activeTabs, 'map');
    if (contentMetrics?.withImages?.documents?.total === 0)
      activeTabs = removeStringFromArray(activeTabs, 'media');
    if (contentMetrics?.withClusters?.documents?.total === 0)
      if (!activeTabs.includes('table'))
        // if there is no table, then add it as the first tab
        activeTabs.unshift('table');

    const c = {
      ...baseConfig.occurrenceSearch,
      ...occurrenceSearchConfig,
      tabs: activeTabs,
      scope: {
        type: 'equals',
        key: 'institutionKey',
        value: key,
      },
    };
    setConfig(c);
  }, [baseConfig, contentMetrics, key, occurrenceSearchConfig]);

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-0">
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
