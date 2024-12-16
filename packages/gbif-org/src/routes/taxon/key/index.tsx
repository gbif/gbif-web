import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { TaxonKey, taxonLoader } from './taxonKey';
import TaxonKeyAbout from './About';
import { TaxonQuery } from '@/gql/graphql';

const id = 'taxonKey';

export const taxonKeyRoute: RouteObjectWithPlugins = {
  id,
  path: 'species/:key',
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `/species/${params.key}`;
  },
  loader: taxonLoader,
  shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }) {
    if (currentUrl.pathname === nextUrl.pathname) return false;
    return defaultShouldRevalidate;
  },
  element: <TaxonKey />,
  children: [
    {
      index: true,
      element: <TaxonKeyAbout />,
    },
  ],
};

export function useTaxonKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: TaxonQuery };
}
