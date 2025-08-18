import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { TaxonSearchPage } from './taxonSearch';

export const taxonSearchRoute: RouteObjectWithPlugins = {
  id: 'speciesSearch',
  path: 'species/search',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/species/search`;
  },
  element: <TaxonSearchPage />,
};
