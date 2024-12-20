import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { TaxonSearchPage } from './taxonSearch';

export const taxonSearchRoute: RouteObjectWithPlugins = {
  id: 'speciesSearch',
  path: 'species/search',
  gbifRedirect: () => {
    return `/species/search`;
  },
  element: (
    <ErrorBoundary>
      <TaxonSearchPage />
    </ErrorBoundary>
  ),
};
