import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { OccurrenceSearchInner } from '@/routes/occurrence/search/occurrenceSearchPage';
import { searchConfig } from '@/routes/occurrence/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useEffect, useState } from 'react';
import { CollectionKeyContext } from './collectionKeyPresentation';

export default function Specimen() {
  const [filter, setFilter] = useFilterParams({ filterConfig: searchConfig });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();
  const { key, collectionMetrics } = useContext(CollectionKeyContext);

  useEffect(() => {
    const occurrenceSearchTabs = [];
    if (collectionMetrics?.withCoordinates?.documents?.total > 0) occurrenceSearchTabs.push('map');
    if (collectionMetrics?.withImages?.documents?.total > 0) occurrenceSearchTabs.push('media');
    if (collectionMetrics?.withClusters?.documents?.total > 0)
      occurrenceSearchTabs.push('clusters');

    const c = {
      ...baseConfig.occurrenceSearch,
      scope: {
        type: 'equals',
        key: 'collectionKey',
        value: key,
      },
    };
    setConfig(c);
  }, [baseConfig, collectionMetrics, key]);

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
