import { ErrorBoundary } from '@/components/ErrorBoundary';
import { InstitutionQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import InstitutionKeyAbout from './About';
import InstitutionKeyCollection from './Collection';
import { InstitutionKey, institutionLoader } from './institutionKey';
import InstitutionKeySpecimens from './Specimen';

const id = 'institutionKey';

export const institutionKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ key } = {}, { grSciCollLocalePrefix = '' }) => {
    if (typeof key !== 'string' && typeof key !== 'number')
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GRSCICOLL}${grSciCollLocalePrefix}/institution/${key}`;
  },
  path: 'institution/:key',
  loader: institutionLoader,
  element: <InstitutionKey />,
  children: [
    {
      index: true,
      element: (
        <ErrorBoundary>
          <InstitutionKeyAbout />
        </ErrorBoundary>
      ),
    },
    {
      path: 'specimens',
      element: (
        <ErrorBoundary>
          <InstitutionKeySpecimens />
        </ErrorBoundary>
      ),
    },
    {
      path: 'collections',
      element: (
        <ErrorBoundary>
          <InstitutionKeyCollection />
        </ErrorBoundary>
      ),
    },
  ],
};

export function useInstitutionKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: InstitutionQuery };
}
