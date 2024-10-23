import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, matchRoutes, RouteObject, RouterProvider } from 'react-router-dom';
import { createGbifRoutes } from '@/gbif/routes';
import { gbifConfig } from '@/gbif/config';
import { Root } from '@/components/root';

hydrate();

async function hydrate() {
  // Configure the routes
  const routes = createGbifRoutes(gbifConfig);

  // Load any lazy routes
  await loadLazyRoutes(routes);

  const router = createBrowserRouter(routes);

  const root = document.getElementById('app');
  if (root == null) throw new Error("Couldn't find root element");

  hydrateRoot(
    root,
    <Root config={gbifConfig}>
      <RouterProvider router={router} fallbackElement={null} />
    </Root>,
    {
      onRecoverableError: (error) => {
        // Ignore intentional suspense errors. See staticRenderSuspence.tsx for more context.
        if (
          error instanceof Error &&
          error.message === 'This component should not be rendered on the server.'
        ) {
          return;
        }

        console.error(error);
      },
    }
  );
}

// This function will allow us to use lazy routes
// Read more about lazy routes here: https://reactrouter.com/en/main/route/lazy
async function loadLazyRoutes(routes: RouteObject[]) {
  // Determine if any of the initial routes are lazy
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => typeof m.route.lazy === 'function'
  );

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = await m.route.lazy!();
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      })
    );
  }
}
