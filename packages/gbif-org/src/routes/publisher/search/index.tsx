import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { PublisherSearchPage } from './publisherSearch';

export const publisherSearchRoute: RouteObjectWithPlugins = {
  id: 'publisherSearch',
  path: 'publisher/search',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/publisher/search`;
  },
  element: <PublisherSearchPage />,
};
