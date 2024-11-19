import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { PublisherSearchPage } from './publisherSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const publisherSearchRoute: RouteObjectWithPlugins = {
  id: 'publisher-search',
  path: 'publisher/search',
  element: (
    <ErrorBoundary>
      <PublisherSearchPage />
    </ErrorBoundary>
  ),
};
