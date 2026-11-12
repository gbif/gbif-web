import { useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import type { ToolLayoutData } from '../../_shared/toolLayout';

export const DATA_VALIDATOR_ROUTE_ID = 'dataValidator';

// The CMS loader sits on the route shared by the root and the key layout.
export function useDataValidatorCmsData() {
  const loaderData = useRenderedRouteLoaderData(DATA_VALIDATOR_ROUTE_ID) as
    { data?: ToolLayoutData } | undefined;
  return loaderData?.data;
}
