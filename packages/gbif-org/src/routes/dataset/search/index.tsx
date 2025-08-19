import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { DatasetSearchPage } from './datasetSearch';

export const datasetSearchRoute: RouteObjectWithPlugins = {
  id: 'datasetSearch',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) =>
    `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/dataset/search`,
  path: 'dataset/search',
  element: <DatasetSearchPage />,
};
