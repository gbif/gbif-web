import { FilterButtons } from '@/components/filters/filterTools';
import { Card } from '@/components/ui/largeCard';
import { useConfig } from '@/config/config';
import { FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useStringParam } from '@/hooks/useParam';
import EntityDrawer from '@/routes/occurrence/search/views/browseList/ListBrowser';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useFilters } from '@/routes/taxon/search/filters';
import { searchConfig } from '@/routes/taxon/search/searchConfig';
import { cn } from '@/utils/shadcn';
import { useContext, useEffect, useMemo, useState } from 'react';
import { TaxonViewTabs, Views } from '../../taxon/search/taxonSearch';
import { DatasetKeyContext } from './datasetKey';

export function TaxonSearchPageInner(): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const defaultView = searchContext?.tabs?.[0] ?? 'table';
  const [view, setView] = useStringParam({
    key: 'view',
    defaultValue: defaultView,
    hideDefault: true,
  });

  const visibleFilters = useMemo(() => {
    if (view === 'table') {
      return filters;
    } else if (view === 'tree') {
      return { higherTaxonKey: filters.higherTaxonKey };
    } else if (filters.q) {
      return { q: filters.q };
    } else {
      return {};
    }
  }, [filters, view]);

  return (
    <>
      <EntityDrawer />

      {/* Our tabs component is very tied into a specific way to handle routes an actions. 
        It would be nice to split it up into a more generic component that can be used in more contexts.
        Could be this where we do search params or it could be links to other sites 
        For now a quick and dirty mock to have the option to do views with a url search param
        */}
      <section className="g-bg-white">
        <Card>
          <TaxonViewTabs
            setView={setView}
            view={view}
            defaultView={defaultView}
            tabs={searchContext.tabs}
          />
          <div
            className={cn('g-border-b g-border-solid g-py-2 g-px-2 g-bg-paperBackground')}
            role="search"
          >
            <FilterButtons filters={visibleFilters} searchContext={searchContext} />
          </div>
        </Card>
      </section>
      <Views view={view} entityDrawerPrefix="tx" className="g-py-2" />
    </>
  );
}
export const DatasetKeyTaxonSearch = () => {
  const { datasetKey } = useContext(DatasetKeyContext);
  const config = useConfig();
  const [searchContext, setSearchContext] = useState({
    ...config.taxonSearch,
    scope: { datasetKey: [datasetKey] },
  });
  useEffect(() => {
    setSearchContext({
      ...config.taxonSearch,
      scope: { datasetKey: [datasetKey] },
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
            <TaxonSearchPageInner />
          </ArticleTextContainer>
        </ArticleContainer>
      </FilterProvider>
    </SearchContextProvider>
  );
};
