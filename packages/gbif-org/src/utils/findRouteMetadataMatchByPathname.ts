import { RouteMetadata } from '@/types';
import { matchPath } from 'react-router-dom';

export function findRouteMetadataMatchByPathname(
  pathname: string,
  routes: RouteMetadata[]
): { route: RouteMetadata; params: Record<string, string | undefined> } | null {
  for (const route of routes) {
    if (route.path) {
      const pathMatch = matchPath({ path: route.path, end: true }, pathname);
      if (pathMatch) return { route, params: pathMatch?.params };
    }

    if (route.children) {
      const match = findRouteMetadataMatchByPathname(pathname, route.children);
      if (match) return match;
    }
  }
  return null;
}
