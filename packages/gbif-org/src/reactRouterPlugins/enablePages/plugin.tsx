import { Config } from '@/config/config';
import { Context, RouteObjectWithPlugins } from '..';
import { RedirectToGbifProvider } from './redirectToGBIFProvider';
import { Outlet, redirectDocument } from 'react-router-dom';
import { createGetRedirectUrl } from './createGetRedirectUrl';

export type DisabledRoutes = Record<string, RouteObjectWithPlugins>;

export function applyEnablePagesPlugin(
  routes: RouteObjectWithPlugins[],
  config: Config,
  context: Context
): RouteObjectWithPlugins[] {
  // If the routes that are being processed are part of a standalone page they should not be filtered
  // A hosted portal could disable a single dataset page, but still show the standalone dataset page in a drawer
  if (context.standalone) return routes;

  // If pages has not been configured we keep all the routes
  if (!config.pages) return routes;

  const disabledRoutes: DisabledRoutes = {};

  return [
    {
      description: 'Redirect to GBIF',
      // The disabledRoutes object will be modified by the addRedirectToLoader function
      children: addRedirectToLoader(routes, disabledRoutes, config),
      element: (
        <RedirectToGbifProvider getRedirectUrl={createGetRedirectUrl(disabledRoutes)}>
          <Outlet />
        </RedirectToGbifProvider>
      ),
    },
  ];
}

function addRedirectToLoader(
  routes: RouteObjectWithPlugins[],
  disabledRoutes: DisabledRoutes,
  config: Config,
  parentPath: string = ''
): RouteObjectWithPlugins[] {
  return routes.map((route) => {
    const routeCopy = { ...route };

    // Construct the current route's absolute path
    const currentPath = route.path
      ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
      : parentPath;

    // Check if the route is disabled
    if (!isRouteEnabled(route, config)) {
      // Add the route to the disabled routes object that is used as a lookup when rewriting dynamic links
      disabledRoutes[currentPath] = route;

      // Modify the loader to redirect to GBIF.org
      const originalLoader = route.loader;

      // This loader should normaly not be executed as all links to the route should be rewritten,
      // but the loader will be called if the page is accessed directly or server side rendered
      // TODO: Do we want to redirect to GBIF.org in this case? A 404 page could maybe be more appropriate
      routeCopy.loader = (...args) => {
        const redirectPath = route.gbifRedirect?.(args[0].params);
        if (redirectPath) {
          return redirectDocument('https://www.gbif.org' + redirectPath);
        }

        return originalLoader?.(...args);
      };
    }

    if (route.children) {
      routeCopy.children = addRedirectToLoader(route.children, disabledRoutes, config, currentPath);
    }

    return routeCopy;
  });
}

function isRouteEnabled(route: RouteObjectWithPlugins, config: Config): boolean {
  // If the route has no id it should be enabled. This could be layouts
  if (!route.id) return true;

  // If the route is enabled it should be marked as enabled
  if (config.pages!.some((config) => config.id === route.id)) return true;

  return false;
}