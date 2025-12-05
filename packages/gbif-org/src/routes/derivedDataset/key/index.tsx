import { DerivedDatasetQuery, DerivedDatasetQueryVariables } from '@/gql/graphql';
import {
  LoaderArgs,
  RouteObjectWithPlugins,
  useRenderedRouteLoaderData,
} from '@/reactRouterPlugins';

import {
  derivedDatasetLoader,
  DerivedDatasetPage,
  DerivedDatasetSkeleton,
} from './derivedDatasetKey';

const id = 'derivedDatasetKey';

export const derivedDatasetKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ doiPrefix, doiSuffix } = {}, { gbifOrgLocalePrefix = '' }) => {
    if (typeof doiPrefix !== 'string' && typeof doiSuffix !== 'string')
      throw new Error(`'Invalid doi (doi is of type ${typeof doiPrefix})`);
    return `${
      import.meta.env.PUBLIC_GBIF_ORG
    }${gbifOrgLocalePrefix}/derivedDataset/${doiPrefix}/${doiSuffix}`;
  },
  path: 'derivedDataset/:doiPrefix/:doiSuffix',
  loader: derivedDatasetLoader,
  loadingElement: <DerivedDatasetSkeleton />,
  element: <DerivedDatasetPage />,
};

export function useDatasetKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: DerivedDatasetQuery };
}
