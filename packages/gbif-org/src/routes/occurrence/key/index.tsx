import { OccurrenceQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { OccurrenceKeyAbout } from './about';
import { OccurrenceKeyCluster } from './cluster';
import { OccurrenceFragment, occurrenceFragmentLoader } from './fragment';
import { OccurrenceKey, occurrenceKeyLoader, OccurrenceKeySkeleton } from './occurrenceKey';
import { OccurrenceKeyPhylo } from './phylogenies';

const id = 'occurrenceKey';

export const occurrenceKeyRoutes: RouteObjectWithPlugins[] = [
  // Used by standalone occurrence key page to show loading before the data is loaded as the skeleton loading only works when navigating between pages
  {
    id: id + '-loading',
    path: 'occurrence/loading',
    element: <OccurrenceKeySkeleton />,
  },
  {
    id,
    path: 'occurrence/:key',
    loader: occurrenceKeyLoader,
    gbifRedirect: (params) => {
      if (typeof params.key !== 'string') throw new Error('Invalid key');
      if (params.key === 'search') return null;
      return `/occurrence/${params.key}`;
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
