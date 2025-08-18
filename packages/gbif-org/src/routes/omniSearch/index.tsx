import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { SearchPage } from './search';

export const omniSearchRoute: RouteObjectWithPlugins = {
  id: 'omniSearch',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) =>
    `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/search`,
  path: 'search',
  element: <SearchPage />,
};
