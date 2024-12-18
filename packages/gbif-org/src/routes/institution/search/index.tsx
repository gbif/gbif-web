import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { InstitutionSearchPage } from './institutionSearch';

export const institutionSearchRoute: RouteObjectWithPlugins = {
  id: 'institutionSearch',
  path: 'institution/search',
  element: (
    <ErrorBoundary>
      <InstitutionSearchPage />
    </ErrorBoundary>
  ),
};
