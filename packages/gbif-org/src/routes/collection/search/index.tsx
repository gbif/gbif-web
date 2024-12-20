import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { CollectionSearchPage } from './collectionSearch';

export const collectionSearchRoute: RouteObjectWithPlugins = {
  id: 'collectionSearch',
  path: 'collection/search',
  gbifRedirect: () => {
    return `/collection/search`;
  },
  element: (
    <ErrorBoundary>
      <CollectionSearchPage />
    </ErrorBoundary>
  ),
};
