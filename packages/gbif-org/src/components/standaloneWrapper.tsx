import { useConfig } from '@/config/config';
import { applyReactRouterPlugins, RouteObjectWithPlugins, useI18n } from '@/reactRouterPlugins';
import { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { StandaloneRoot } from './root';

type Props = {
  routes: RouteObjectWithPlugins[];
  url: string;
};

export function StandaloneWrapper({ routes, url }: Props) {
  const config = useConfig();
  const rootNavigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const routerRef = useRef<ReturnType<typeof createMemoryRouter>>();
  const rootRef = useRef<ReturnType<typeof createRoot>>();
  const { localizeLink } = useI18n();
  const [routerIsReady, setRouterIsReady] = useState(false);

  useEffect(() => {
    const renderTimeout = setTimeout(() => {
      if (ref.current && !rootRef.current) {
        rootRef.current = createRoot(ref.current);
      }

      if (ref.current && rootRef.current) {
        const routesWithNotFoundRedirect: RouteObjectWithPlugins[] = [
          ...routes,
          {
            path: '*',
            loader: ({ request }) => {
              const url = new URL(request.url);
              rootNavigate(url.pathname);
              return null;
            },
          },
        ];

        const routesWithPlugins = applyReactRouterPlugins(routesWithNotFoundRedirect, config, {
          standalone: true,
        });
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

  return <div ref={ref} />;
}
