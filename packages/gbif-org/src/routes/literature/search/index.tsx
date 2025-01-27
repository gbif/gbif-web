import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { LiteratureSearchPage } from './literatureSearch';

export const literatureSearchRoute: RouteObjectWithPlugins = {
  id: 'literatureSearch',
  gbifRedirect: () => `${import.meta.env.PUBLIC_GBIF_ORG}/literature/search`,
  path: 'literature/search',
  element: (
    <ErrorBoundary>
      <LiteratureSearchPage />
    </ErrorBoundary>
  ),
};
