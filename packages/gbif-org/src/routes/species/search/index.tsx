import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { redirectDocument } from 'react-router-dom';

export const speciesSearchRoute: RouteObjectWithPlugins = {
  id: 'speciesSearch',
  path: 'species/search',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/species/search`;
  },
  element: null,
  loader: () => redirectDocument('/taxon/search'),
};
