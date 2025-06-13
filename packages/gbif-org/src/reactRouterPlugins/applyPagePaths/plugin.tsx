import { Config, PageConfig } from '@/config/config';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { createContext } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteObjectWithPlugins } from '..';

export const PageContext = createContext<PageConfig[]>([]);

export function applyPagePathsPlugin(
  routes: RouteObjectWithPlugins[],
  config: Config
): RouteObjectWithPlugins[] {
  // If the routes that are being processed are part of a standalone page they should not be filtered and overwriten
  // A hosted portal could disable a single dataset page, but still show the standalone dataset page in a drawer
  const customPages = structuredClone(config.pages);

  const pages: PageConfig[] = [];
  // following line push items to pages array
  const modifiedRoutes = addPaths(routes, pages, customPages);

  return [
    {
      description: 'Apply custom paths and provide a context with page paths',
      // The disabledRoutes object will be modified by the addRedirectToLoader function
      children: modifiedRoutes,
      errorElement: <RootErrorPage />,
      element: (
        <PageContext.Provider value={pages}>
          <Outlet />
        </PageContext.Provider>
      ),
    },
  ];
}

function addPaths(
  routes: RouteObjectWithPlugins[],
  pages: PageConfig[],
  customPages?: PageConfig[]
): RouteObjectWithPlugins[] {
  const filteredRoutes = routes
    .map((route) => {
      const routeCopy = { ...route };

      // if a pages array is enabled, then only some pages are enabled and som ecan be on custom paths or have custom implementations
      if (customPages && route.id) {
        // first see if there is a match for this route in the custom pages.
        const pageConfig = customPages!.find((page) => page.id === route.id);

        // if no page match, then the user have not enabled this page, so we should remove it
        if (!pageConfig) {
          // the route is not included on the site, so we should remove it
          // but add it to the pages array so we can rewrite links to it to point to gbif.org
          if (routeCopy.id) {
            pages.push({
              id: routeCopy.id,
              path: routeCopy.path,
              redirect: true,
              gbifRedirect: routeCopy.gbifRedirect,
            });
          }
          return null;
        }

        if (typeof pageConfig?.path === 'string') {
          routeCopy.path = pageConfig.path;
        }

        if (pageConfig?.isCustom) {
          // no need to do more, this route should be removed completely as the user have a custom implementation for it.
          // It will be removed in filter below
          routeCopy.isCustom = pageConfig?.isCustom;
        }
      }
      if (route.id) {
        pages.push({ id: route.id, path: routeCopy.path, isCustom: routeCopy.isCustom });
      }

      if (route.children) {
        routeCopy.children = addPaths(route.children, pages, customPages);
      }

      return routeCopy;
    })
    // remove all routes that are not enabled
    .filter((route) => !!route && !route.isCustom);

  return filteredRoutes;
}

export function getStandalonePageContext(config: Config, routes: RouteObjectWithPlugins[]) {
  const pages: PageConfig[] = [];
  // following line push items to pages array
  addPaths(routes, pages, structuredClone(config.pages));

  return pages.map((page) => ({ ...page, isCustom: true }));
}
