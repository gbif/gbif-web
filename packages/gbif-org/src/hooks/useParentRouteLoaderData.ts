import { useI18n } from '@/contexts/i18n';
import { useMetadataRoutes } from '@/contexts/metadataRoutes';
import { createRouteId } from '@/utils/createRouteId';
import { findRouteMetadataMatchById } from '@/utils/findRouteMetadataMathById';
import { useRouteLoaderData } from 'react-router-dom';

// This makes sure that the id is always in sync with the routes.tsx file.
export enum RouteId {
  Project = 'project',
}

// Use this hook to get the loader data from a parent route.
// You must provide the id of the parent route.
// The id is defined in the routes.tsx file.

export function useParentRouteLoaderData(parentId: RouteId) {
  const { locale } = useI18n();

  // Find out if the parent route is a slugified route as that will change the id
  const metadataRoutes = useMetadataRoutes();
  const route = findRouteMetadataMatchById(parentId, metadataRoutes);
  const isSlugified = route?.isSlugified;

  return useRouteLoaderData(createRouteId(parentId, locale.code, isSlugified));
}
