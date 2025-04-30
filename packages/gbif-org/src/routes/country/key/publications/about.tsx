import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, SearchMetadata } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { LiteratureSearchInner } from '@/routes/literature/search/literatureSearch';
import { searchConfig } from '@/routes/literature/search/searchConfig';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useState } from 'react';

export function CountryKeyPublicationsAbout() {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const baseConfig = useConfig();
  const [config, setConfig] = useState<SearchMetadata | undefined>();
  const literatureSearchConfig = baseConfig?.datasetKey?.literatureSearch;

  useEffect(() => {
    const c = {
      ...baseConfig.literatureSearch,
      ...literatureSearchConfig,
      excludedFilters: [...(literatureSearchConfig?.excludedFilters ?? []), 'countriesOfCoverage'],
      highlightedFilters: [
        ...(literatureSearchConfig?.highlightedFilters ?? []),
        'countriesOfCoverage',
      ],
      scope: {
        type: 'equals',
        key: 'countriesOfCoverage',
        value: 'DK',
      },
    };
    setConfig(c);
  }, [baseConfig, literatureSearchConfig]);

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
