import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { PublisherSearchPage } from './publisherSearch';

export const publisherSearchRoute: RouteObjectWithPlugins = {
  id: 'publisherSearch',
  path: 'publisher/search',
  gbifRedirect: () => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}/publisher/search`;
  },
  element: (
    <ErrorBoundary>
      <PublisherSearchPage />
    </ErrorBoundary>
  ),
};
