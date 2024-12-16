import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { PublisherSearchPage } from './publisherSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const publisherSearchRoute: RouteObjectWithPlugins = {
  id: 'publisherSearch',
  path: 'publisher/search',
  element: (
    <ErrorBoundary>
      <PublisherSearchPage />
    </ErrorBoundary>
  ),
};
