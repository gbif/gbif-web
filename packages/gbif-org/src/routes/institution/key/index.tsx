import { InstitutionQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import InstitutionKeyAbout from './About';
import InstitutionKeyCollection from './Collection';
import { InstitutionKey, institutionLoader } from './institutionKey';
import InstitutionKeySpecimens from './Specimen';

const id = 'institutionKey';

export const institutionKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `${import.meta.env.PUBLIC_GRSCICOLL}/institution/${params.key}`;
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
