import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { datasetLoader, DatasetPage, DatasetPageSkeleton } from './datasetKey';
import { DatasetKeyAbout } from './about';
import { DatasetKeyDashboard } from './dashboard';
import { DatasetKeyOccurrences } from './occurrences';
import { DatasetKeyDownload } from './download';
import { DatasetQuery } from '@/gql/graphql';

const id = 'dataset-key';

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
