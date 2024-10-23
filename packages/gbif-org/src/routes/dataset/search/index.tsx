import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { DatasetSearchPage } from './datasetSearch';

export const datasetSearchRoute: RouteObjectWithPlugins = {
  id: 'dataset-search',
  gbifRedirect: () => '/dataset/search',
  path: 'dataset/search',
  element: <DatasetSearchPage />,
};
