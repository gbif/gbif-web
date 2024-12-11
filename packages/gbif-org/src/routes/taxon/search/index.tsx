import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { TaxonSearchPage } from './taxonSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const taxonSearchRoute: RouteObjectWithPlugins = {
  id: 'taxon-search',
  path: 'species/search',
  element: (
    <ErrorBoundary>
      <TaxonSearchPage />
    </ErrorBoundary>
  ),
};
