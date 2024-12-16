import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { TaxonSearchPage } from './taxonSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const taxonSearchRoute: RouteObjectWithPlugins = {
  id: 'taxonSearch',
  path: 'species/search',
  element: (
    <ErrorBoundary>
      <TaxonSearchPage />
    </ErrorBoundary>
  ),
};
