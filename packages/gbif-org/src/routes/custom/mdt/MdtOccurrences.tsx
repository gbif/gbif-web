import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { OccurrenceSearchInner } from '@/routes/occurrence/search/occurrenceSearchPage';
import { searchConfig } from '@/routes/occurrence/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useEffect, useState } from 'react';
import { MdtDataContext } from './MdtData';
import { Skeleton } from '@/components/ui/skeleton';

export function MdtOccurrences() {
  const { datasetKeys }: { datasetKeys: string[] } = useContext(MdtDataContext);

  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset', 'from'],
    defaultChecklistKey: useConfig().defaultChecklistKey,
  });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();

  useEffect(() => {
    if (!datasetKeys) return;
    const activeTabs = ['table', 'map', 'datasets', 'dashboard', 'download'];

    const c = {
      ...baseConfig.occurrenceSearch,

      highlightedFilters: [
        'occurrenceStatus',
        'taxonKey',
        'year',
        'country',
        'datasetKey',
        'geometry',
      ],
      tabs: activeTabs,
      scope: {
        type: 'in',
        key: 'datasetKey',
        values: datasetKeys,
      },
    };
    setConfig(c);
  }, [baseConfig, datasetKeys]);

  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {config && (
          <SearchContextProvider searchContext={config}>
            <FilterProvider filter={filter} onChange={setFilter}>
              {datasetKeys.length > 0 && <OccurrenceSearchInner />}
              {datasetKeys.length === 0 &&
                Array.from({ length: 10 }).map((x, i) => (
                  <tr key={i}>
                    <td>
                      <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                    </td>
                    <td>
                      <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                    </td>
                    <td>
                      <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                    </td>
                    <td>
                      <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                    </td>
                  </tr>
                ))}
            </FilterProvider>
          </SearchContextProvider>
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
