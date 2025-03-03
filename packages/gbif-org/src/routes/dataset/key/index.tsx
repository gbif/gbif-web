import { DatasetQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { DatasetKeyAbout } from './about';
import { DatasetKeyDashboard } from './dashboard';
import { datasetLoader, DatasetPage, DatasetPageSkeleton } from './datasetKey';
import { DatasetKeyDownload } from './download';
import { DatasetKeyLiterature } from './literature';
import { DatasetKeyOccurrences } from './occurrences';
import { DatasetKeyPhylo } from './phylogenies';
import { DatasetKeyProject } from './project';
import { DatasetKeyTaxonSearch } from './taxonSearch';

const id = 'datasetKey';

export const datasetKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
    if (typeof key !== 'string' && typeof key !== 'number')
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/dataset/${key}`;
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
      path: 'citations',
      element: <DatasetKeyLiterature />,
    },
    {
      path: 'project',
      element: <DatasetKeyProject />,
    },
    {
      path: 'phylogenies',
      element: <DatasetKeyPhylo />,
    },
    {
      path: 'species',
      element: <DatasetKeyTaxonSearch />,
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
