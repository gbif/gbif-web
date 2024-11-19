import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { CollectionSearchPage } from './collectionSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const collectionSearchRoute: RouteObjectWithPlugins = {
  id: 'collection-search',
  path: 'collection/search',
  element: (
    <ErrorBoundary>
      <CollectionSearchPage />
    </ErrorBoundary>
  ),
};
