import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { InstitutionSearchPage } from './searchPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const institutionSearchRoute: RouteObjectWithPlugins = {
  id: 'institution-search',
  path: 'institution/search',
  element: (
    <ErrorBoundary>
      <InstitutionSearchPage />
    </ErrorBoundary>
  ),
};
