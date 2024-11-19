import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { DatasetSearchPage } from './datasetSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const datasetSearchRoute: RouteObjectWithPlugins = {
  id: 'dataset-search',
  gbifRedirect: () => '/dataset/search',
  path: 'dataset/search',
  element: <ErrorBoundary><DatasetSearchPage /></ErrorBoundary>,
};
