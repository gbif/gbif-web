import { useI18n } from '@/contexts/i18n';
import { createLocalizedRouteId } from '@/utils/createLocalizedRouteId';
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
  return useRouteLoaderData(createLocalizedRouteId(parentId, locale.code));
}
