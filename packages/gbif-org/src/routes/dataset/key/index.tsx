import { DatasetQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { DatasetKeyAbout } from './about';
import { DatasetKeyDashboard } from './dashboard';
import { datasetLoader, DatasetPage, DatasetPageSkeleton } from './datasetKey';
import { DatasetKeyDownload } from './download';
import { DatasetKeyOccurrences } from './occurrences';

const id = 'datasetKey';

export const datasetKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `/dataset/${params.key}`;
  },
  path: 'dataset/:key',
  loader: datasetLoader,
  loadingElement: <DatasetPageSkeleton />,
  element: <DatasetPage />,
  children: [
    {
      index: true,
      element: <DatasetKeyAbout />,
    },
    {
      path: 'dashboard',
      element: <DatasetKeyDashboard />,
    },
    {
      path: 'occurrences',
      element: <DatasetKeyOccurrences />,
    },
    {
      path: 'download',
      element: <DatasetKeyDownload />,
    },
  ],
};

export function useDatasetKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: DatasetQuery };
}
