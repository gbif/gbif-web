import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { InstitutionKey, institutionLoader } from './institutionKey';
import InstitutionKeyAbout from './About';
import InstitutionKeySpecimens from './Specimen';
import InstitutionKeyCollection from './Collection';
import { InstitutionQuery } from '@/gql/graphql';

const id = 'institution-key';

export const institutionKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `/institution/${params.key}`;
  },
  path: 'institution/:key',
  loader: institutionLoader,
  element: <InstitutionKey />,
  children: [
    {
      index: true,
      element: <InstitutionKeyAbout />,
    },
    {
      path: 'specimen',
      element: <InstitutionKeySpecimens />,
    },
    {
      path: 'collection',
      element: <InstitutionKeyCollection />,
    },
  ],
};

export function useInstitutionKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: InstitutionQuery };
}
