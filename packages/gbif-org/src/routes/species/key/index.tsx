import { SpeciesKeyQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { SpeciesKey, speciesLoader } from './speciesKey';

const id = 'speciesKey';

export const speciesKeyRoute: RouteObjectWithPlugins = {
  id,
  path: 'species/:key',
  gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
    if (!key) return null;
    if (typeof key !== 'string' && typeof key !== 'number')
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/species/${key}`;
  },
  loader: speciesLoader,
  element: <SpeciesKey />,
};

export function useSpeciesKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: SpeciesKeyQuery };
}
