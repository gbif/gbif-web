import { OccurrenceQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { OccurrenceKeyAbout } from './about';
import { OccurrenceKeyCluster } from './cluster';
import { OccurrenceFragment, occurrenceFragmentLoader } from './fragment';
import { OccurrenceKey, occurrenceKeyLoader, OccurrenceKeySkeleton } from './occurrenceKey';
import { OccurrenceKeyPhylo } from './phylogenies';

const id = 'occurrenceKey';

export const occurrenceKeyRoutes: RouteObjectWithPlugins[] = [
  {
    id,
    path: 'occurrence/:key',
    loader: occurrenceKeyLoader,
    gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
      if (typeof key !== 'string' && typeof key !== 'number')
        throw new Error(`'Invalid key (key is of type ${typeof key})`);
      if (key === 'search') return null;
      return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/occurrence/${key}`;
    },
    loadingElement: <OccurrenceKeySkeleton />,
    element: <OccurrenceKey />,
    children: [
      {
        index: true,
        element: <OccurrenceKeyAbout />,
      },
      {
        path: 'phylogenies',
        element: <OccurrenceKeyPhylo />,
      },
      {
        path: 'related',
        element: <OccurrenceKeyCluster />,
      },
    ],
  },
  {
    id: id + '-fragment',
    path: 'occurrence/:key/fragment',
    element: <OccurrenceFragment />,
    loader: occurrenceFragmentLoader,
  },
];

export function useOccurrenceKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: OccurrenceQuery };
}
