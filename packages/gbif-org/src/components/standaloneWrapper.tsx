import { Config, PageConfig } from '@/config/config';
import { applyReactRouterPlugins, RouteObjectWithPlugins, useI18n } from '@/reactRouterPlugins';
import { PageContext } from '@/reactRouterPlugins/applyPagePaths/plugin';
import { PORTAL_CONTAINER_SELECTOR, PortalContainerContext } from '@/utils/getPortalContainer';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createMemoryRouter,
  NavigateFunction,
  Outlet,
  RouteObject,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';
import { LoadingIndicator } from './loadingIndicator';
import { StandaloneRoot } from './root';
import { RootErrorPage } from '@/routes/rootErrorPage';

type Props = {
  routes: RouteObjectWithPlugins[];
  loadingElement?: React.ReactNode;
  url: string;
  config: Config;
};

export function StandaloneWrapper({ routes, url, loadingElement, config }: Props) {
  const rootNavigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const routerRef = useRef<ReturnType<typeof createMemoryRouter>>();
  const rootRef = useRef<ReturnType<typeof createRoot>>();
  const { localizeLink } = useI18n();
  const [routerIsReady, setRouterIsReady] = useState(false);
  const [initialRenderDone, setInitialRenderDone] = useState(false);
  const parentPages = useContext(PageContext);

  useEffect(() => {
    const renderTimeout = setTimeout(() => {
      if (ref.current && !rootRef.current) {
        rootRef.current = createRoot(ref.current);
      }

      if (ref.current && rootRef.current) {
        const routesWithPlugins = createRoutesWithPlugins(routes, config, rootNavigate, () =>
          setInitialRenderDone(true)
        );
        routerRef.current = createMemoryRouter(routesWithPlugins);
        setRouterIsReady(true);

        // React context does not cross the createRoot boundary, so the enclosing
        // drawer/dialog's portal container must be re-provided inside the new root.
        // Resolved from the live DOM here since the host tree's context value may
        // not be published yet when this effect captures its closure.
        const portalContainer = ref.current.closest<HTMLElement>(PORTAL_CONTAINER_SELECTOR);

        rootRef.current.render(
          <PortalContainerContext.Provider value={portalContainer}>
            <ParentPagesContext.Provider
              value={parentPages.map((page) => ({ ...page, isCustom: true }))}
            >
              <StandaloneRoot config={config}>
                <RouterProvider router={routerRef.current} />
              </StandaloneRoot>
            </ParentPagesContext.Provider>
          </PortalContainerContext.Provider>
        );
      }
    });

    return () => {
      clearTimeout(renderTimeout);

      const root = rootRef.current;
      rootRef.current = undefined;

      setTimeout(() => root?.unmount());
    };
  }, [routes, config, rootNavigate]);

  // Navigate to the url when it changes
  useEffect(() => {
    if (routerIsReady) {
      routerRef.current?.navigate(localizeLink(url));
    }
  }, [url, localizeLink, routerIsReady]);

  return (
    <>
      <div className={initialRenderDone ? 'g-block' : 'g-invisible'} ref={ref} />
      {!initialRenderDone && loadingElement}
    </>
  );
}

function createRoutesWithPlugins(
  routes: RouteObjectWithPlugins[],
  config: Config,
  rootNavigate: NavigateFunction,
  onRenderDone: () => void
): RouteObject[] {
  return applyReactRouterPlugins(
    [
      {
        element: (
          <>
            <LoadingIndicator />
            <OnRenderDone onDone={onRenderDone} />
            <Outlet />
          </>
        ),
        errorElement: (
          <>
            <RootErrorPage />
            <OnRenderDone onDone={onRenderDone} />
          </>
        ),
        children: [
          ...routes,
          {
            path: '*',
            loader: ({ request }) => {
              const url = new URL(request.url);
              rootNavigate(url.pathname);
              return null;
            },
          },
        ],
      },
    ],
    config
  );
}

function OnRenderDone({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    onDone();
  }, [onDone]);

  return null;
}

export const ParentPagesContext = createContext<PageConfig[]>(null!);
