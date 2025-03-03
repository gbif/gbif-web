import { TaxonQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import TaxonKeyAbout from './About';
import Metrics from './Metrics';
import VerbatimTaxon from './Verbatim';
import { TaxonKey, taxonLoader } from './taxonKey';
const id = 'speciesKey';

export const taxonKeyRoute: RouteObjectWithPlugins = {
  id,
  path: 'species/:key',
  gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
    if (typeof key !== 'string' && typeof key !== 'number')
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/species/${key}`;
  },
  loader: taxonLoader,
  /* shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }) {
    if (currentUrl.pathname === nextUrl.pathname) return false;
    return defaultShouldRevalidate;
  }, */
  element: <TaxonKey />,
  children: [
    {
      index: true,
      element: <TaxonKeyAbout />,
    },
    {
      path: 'metrics',
      element: <Metrics />,
    },
    {
      path: 'verbatim',
      element: <VerbatimTaxon />,
    },
  ],
};

export function useTaxonKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: TaxonQuery };
}
