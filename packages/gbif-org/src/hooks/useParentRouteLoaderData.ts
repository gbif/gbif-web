import { useI18n } from '@/contexts/i18n';
import { createRouteId } from '@/utils/createRouteId';
import { useRouteLoaderData } from 'react-router-dom';

// This makes sure that the id is always in sync with the routes.tsx file.
export enum RouteId {
  Project = 'project',
  Network = 'network',
  Installation = 'installation',
}

// Use this hook to get the loader data from a parent route.
// You must provide the id of the parent route.
// The id is defined in the routes.tsx file.
export function useParentRouteLoaderData(parentId: RouteId) {
  const { locale } = useI18n();

  // Some routes that have slugified enabled could not a a title to slugify.
  // In that case the data will be on the none slugified route.
  // Because of that we need to check both routes while prioritizing the slugified route.
  const slugifiedRouteData = useRouteLoaderData(createRouteId(parentId, locale.code, true));
  const routeData = useRouteLoaderData(createRouteId(parentId, locale.code, false));

  return slugifiedRouteData || routeData;
}
