import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { DatasetSearchPage } from './datasetSearch';

export const datasetSearchRoute: RouteObjectWithPlugins = {
  id: 'datasetSearch',
  gbifRedirect: () => `${import.meta.env.PUBLIC_GBIF_ORG}/dataset/search`,
  path: 'dataset/search',
  element: (
    <ErrorBoundary>
      <DatasetSearchPage />
    </ErrorBoundary>
  ),
};
