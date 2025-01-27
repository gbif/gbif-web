import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { InstitutionSearchPage } from './institutionSearch';

export const institutionSearchRoute: RouteObjectWithPlugins = {
  id: 'institutionSearch',
  path: 'institution/search',
  gbifRedirect: () => {
    return `${import.meta.env.PUBLIC_GRSCICOLL}/institution/search`;
  },
  element: (
    <ErrorBoundary>
      <InstitutionSearchPage />
    </ErrorBoundary>
  ),
};
