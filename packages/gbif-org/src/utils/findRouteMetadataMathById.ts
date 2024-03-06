import { RouteId } from '@/hooks/useParentRouteLoaderData';
import { RouteMetadata } from '@/types';

export function findRouteMetadataMatchById(
  id: RouteId,
  routes: RouteMetadata[]
): RouteMetadata | null {
  for (const route of routes) {
    if (route?.id === id) return route;

    if (route.children) {
      const match = findRouteMetadataMatchById(id, route.children);
      if (match) return match;
    }
  }
  return null;
}
