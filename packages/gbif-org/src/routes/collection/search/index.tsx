import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { CollectionSearchPage } from './collectionSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const collectionSearchRoute: RouteObjectWithPlugins = {
  id: 'collectionSearch',
  path: 'collection/search',
  element: (
    <ErrorBoundary>
      <CollectionSearchPage />
    </ErrorBoundary>
  ),
};
