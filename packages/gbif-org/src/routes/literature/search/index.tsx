import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { LiteratureSearchPage } from './literatureSearch';

export const literatureSearchRoute: RouteObjectWithPlugins = {
  id: 'literatureSearch',
  gbifRedirect: () => '/literature/search',
  path: 'literature/search',
  element: (
    <ErrorBoundary>
      <LiteratureSearchPage />
    </ErrorBoundary>
  ),
};
