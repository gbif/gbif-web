import { Config } from '@/config/config';
import { matchPath } from 'react-router-dom';
import { RouteObjectWithPlugins } from '..';
import { DisabledRoutes } from './plugin';

export type GetRedirectUrl = (path: string) => string | null;

export function createGetRedirectUrl(
  disabledRoutes: DisabledRoutes,
  config: Config,
  modifiedRoutes: RouteObjectWithPlugins[]
): GetRedirectUrl {
  return (path: string) => {
    // iterate over modifiedRoutes and child routes to find one that matches the path
    const firstRouteMatch = getFirstRouteMatch(modifiedRoutes, path);
    console.log('firstRouteMatch', firstRouteMatch);

    for (const [pattern, route] of Object.entries(disabledRoutes)) {
      const matchResult = matchPath({ path: pattern, end: true }, path);
      if (matchResult && route.gbifRedirect) {
        const redirectPath = route.gbifRedirect?.(matchResult.params);
        if (redirectPath) return 'https://www.gbif.org' + redirectPath;
      }
    }

    return null;
  };
}

function getFirstRouteMatch(
  routes: RouteObjectWithPlugins[],
  path: string
): RouteObjectWithPlugins | null {
  // use matchPath to find the first route that matches the path
  for (const route of routes) {
    if (route.path) {
      const matchResult = matchPath({ path: route.path, end: true }, path);
      if (matchResult) {
        return route;
      }
    }
    if (route.children) {
      const childMatch = getFirstRouteMatch(route.children, path);
      if (childMatch) return childMatch;
    }
  }
  return null;
}
