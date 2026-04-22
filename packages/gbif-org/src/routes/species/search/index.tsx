import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { SpeciesSearchPage } from './speciesSearch';
import { redirectDocument } from '@remix-run/router/dist/utils';

export const speciesSearchRoute: RouteObjectWithPlugins = {
  id: 'speciesSearch',
  path: 'species/search',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/species/search`;
  },
  element: <SpeciesSearchPage />,
  loader: () => redirectDocument('/taxon/search'),
};
