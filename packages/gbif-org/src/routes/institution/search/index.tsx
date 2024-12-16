import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
