import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { LiteratureSearchPage } from './literatureSearch';

export const literatureSearchRoute: RouteObjectWithPlugins = {
  id: 'literatureSearch',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) =>
    `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/literature/search`,
  path: 'literature/search',
  element: <LiteratureSearchPage />,
};
