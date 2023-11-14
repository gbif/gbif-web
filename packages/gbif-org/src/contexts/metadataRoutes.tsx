import { RouteMetadata } from '@/types';
import React from 'react';
import { useConfig } from './config';
import { matchPath } from 'react-router-dom';

const MetadataRoutesContext = React.createContext<RouteMetadata[] | null>(null);

type Props = {
  children?: React.ReactNode;
  metadataRoutes: RouteMetadata[];
};

export function MetadataRoutesProvider({ metadataRoutes, children }: Props) {
  return (
    <MetadataRoutesContext.Provider value={metadataRoutes}>
      {children}
    </MetadataRoutesContext.Provider>
  );
}

function findRouteMatch(
  pathname: string,
  routes: RouteMetadata[]
): { route: RouteMetadata; params: Record<string, string | undefined> } | null {
  for (const route of routes) {
    if (route.path) {
      const pathMatch = matchPath({ path: route.path, end: true }, pathname);
      if (pathMatch) return { route, params: pathMatch?.params };
    }

    if (route.children) {
      const match = findRouteMatch(pathname, route.children);
      if (match) return match;
    }
  }
  return null;
}

export function useExternalGbifLink(to: string): null | string {
  const { pages } = useConfig();
  const metadataRoutes = React.useContext(MetadataRoutesContext);

  if (!metadataRoutes) {
    throw new Error('useShouldRedirect must be used within a MetadataRoutesProvider');
  }

  // There should never be redirected if the config has no pages array
  if (!Array.isArray(pages)) return null;

  // Find the route metadata for the to url
  const match = findRouteMatch(to, metadataRoutes);

  // If no match, return null
  if (!match) return null;

  // Only matches with a key can be excluded from the routes
  if (!match.route.key) return null;

  // The route is activated if it is in the pages array, so return null if it is
  if (pages.some((page) => page.key === match.route.key)) return null;

  // If no external link is defined, throw an error
  if (!match.route.gbifRedirect) {
    throw new Error(`No gbifRedirect link defined for route ${match.route.key}`);
  }

  // Return the external link
  return match.route.gbifRedirect(match.params);
}
