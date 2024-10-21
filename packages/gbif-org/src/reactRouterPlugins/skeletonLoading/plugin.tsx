import { AbortLoadingEvent, StartLoadingEvent } from './events';
import { LoadingContext } from './loadingContextProvider';
import { cloneElement, isValidElement, useContext } from 'react';
import { NavigationListener } from './navigationListener';
import { RouteObjectWithPlugins } from '..';

export type ErrorPageProps = {
  loadingElement?: React.ReactNode;
};

export function applySkeletonLoadingPlugin(
  routes: RouteObjectWithPlugins[],
  routeLookup: Map<string, RouteObjectWithPlugins> = new Map()
): RouteObjectWithPlugins[] {
  return [
    {
      description: 'Root route for skeleton loading',
      element: <NavigationListener />,
      children: routes.map((route) => {
        const routeCopy = { ...route };

        // Recursively apply the plugin to all children
        if (Array.isArray(routeCopy.children)) {
          routeCopy.children = applySkeletonLoadingPlugin(routeCopy.children, routeLookup);
        }

        routeCopy.internalPluginId = crypto.randomUUID();

        // Index the route by id
        routeLookup.set(routeCopy.internalPluginId, routeCopy);

        modifyLoader(routeCopy);
        modifyElement(routeCopy, routeLookup);
        modifyErrorElement(routeCopy, routeLookup);

        return routeCopy;
      }),
    },
  ];
}

function modifyLoader(route: RouteObjectWithPlugins) {
  const originalLoader = route.loader;

  route.loader = (...args) => {
    // Abort the the loading if the loader gets cancelled
    args[0].request.signal.addEventListener('abort', () => {
      new AbortLoadingEvent().dispatch();
    });

    // Dispatch an event to signal that the loading has started
    new StartLoadingEvent(route.internalPluginId!).dispatch();

    // Deletage the actual loading logic to the original loader
    if (typeof originalLoader === 'function') {
      return originalLoader(...args);
    }

    return null;
  };
}

function modifyElement(
  route: RouteObjectWithPlugins,
  routeLookup: Map<string, RouteObjectWithPlugins>
) {
  if (!route.element) return;

  const originalElement = route.element;

  const Element = () => {
    const activeLoadingId = useContext(LoadingContext);

    const sameRouteLoading = route.internalPluginId === activeLoadingId;
    const childrenRouteNotLoading = getChildrenRoutes(route).every(
      (route) => route.internalPluginId !== activeLoadingId
    );

    if (activeLoadingId && (sameRouteLoading || childrenRouteNotLoading)) {
      const activeLoadingRoute = routeLookup.get(activeLoadingId);

      if (activeLoadingRoute?.loadingElement) {
        return activeLoadingRoute.loadingElement;
      }
    }

    return originalElement;
  };

  route.element = <Element />;
}

function modifyErrorElement(
  route: RouteObjectWithPlugins,
  routeLookup: Map<string, RouteObjectWithPlugins>
) {
  if (!route.errorElement) return;
  if (!isValidElement(route.errorElement)) return;

  const originalErrorElement = route.errorElement;

  const ErrorElement = () => {
    const activeLoadingId = useContext(LoadingContext);
    if (!activeLoadingId) return originalErrorElement;

    const activeLoadingRoute = routeLookup.get(activeLoadingId);
    if (!activeLoadingRoute?.loadingElement) return originalErrorElement;

    const newProps = { loadingElement: activeLoadingRoute.loadingElement };
    return cloneElement(originalErrorElement, newProps);
  };

  route.errorElement = <ErrorElement />;
}

function getChildrenRoutes(
  route: RouteObjectWithPlugins,
  keepSelf = false
): RouteObjectWithPlugins[] {
  const children = route.children || [];
  return children.reduce(
    (acc, child) => [...acc, ...getChildrenRoutes(child, true)],
    keepSelf ? [route] : []
  );
}
