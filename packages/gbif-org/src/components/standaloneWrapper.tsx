import { Config, useConfig } from '@/config/config';
import { applyReactRouterPlugins, RouteObjectWithPlugins, useI18n } from '@/reactRouterPlugins';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createMemoryRouter,
  NavigateFunction,
  Outlet,
  RouteObject,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';
import { StandaloneRoot } from './root';
import { LoadingIndicator } from './loadingIndicator';

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

        rootRef.current.render(
          <StandaloneRoot config={config}>
            <RouterProvider router={routerRef.current} />
          </StandaloneRoot>
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
    config,
    {
      standalone: true,
    }
  );
}

function OnRenderDone({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    onDone();
  }, [onDone]);

  return null;
}
