import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { PublisherSearchPage } from './publisherSearch';

export const publisherSearchRoute: RouteObjectWithPlugins = {
  id: 'publisherSearch',
  path: 'publisher/search',
  element: (
    <ErrorBoundary>
      <PublisherSearchPage />
    </ErrorBoundary>
  ),
};
