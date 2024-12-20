import { Config, PageConfig } from '@/config/config';
import { createContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Context, RouteObjectWithPlugins } from '..';

export const PageContext = createContext<PageConfig[]>([]);

export function applyPagePathsPlugin(
  routes: RouteObjectWithPlugins[],
  config: Config,
  context: Context
): RouteObjectWithPlugins[] {
  // If the routes that are being processed are part of a standalone page they should not be filtered and overwriten
  // A hosted portal could disable a single dataset page, but still show the standalone dataset page in a drawer
  const customPages = context.standalone ? [] : config?.pages;

  const pages: PageConfig[] = [];
  // following line push items to pages array
  const modifiedRoutes = addPaths(routes, pages, customPages);

  return [
    {
      description: 'Apply custom paths and provide a context with page paths',
      // The disabledRoutes object will be modified by the addRedirectToLoader function
      children: modifiedRoutes,
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
  return routes
    .map((route) => {
      const routeCopy = { ...route };

      if (customPages) {
        // find matching config.pages entry if any
        const pageConfig = customPages!.find((page) => page.id === route.id);

        if (pageConfig?.isCustom) {
          // no need to do more, this route should be removed completely and will be removed in filter below
          routeCopy.isCustom = pageConfig?.isCustom;
          return routeCopy;
        }

        if (pageConfig?.path) {
          routeCopy.path = pageConfig.path;
        }
      }

      if (route.children) {
        routeCopy.children = addPaths(route.children, pages, customPages);
      }
      if (route.id) {
        pages.push({ id: route.id, path: routeCopy.path, isCustom: routeCopy.isCustom });
      }

      return routeCopy;
    })
    .filter((route) => !!route && !route.isCustom);
}
