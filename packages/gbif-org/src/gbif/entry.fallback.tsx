// renderToString that we use for server side rendering does not support error boundaries, so this file it used to client render the GBIF portal in case we encounter a server side error we cant recover from

import { Root } from '@/components/root';
import { gbifConfig } from '@/gbif/config';
import { createGbifRoutes } from '@/gbif/routes';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Configure the routes
const routes = createGbifRoutes(gbifConfig);

const router = createBrowserRouter(routes);

const rootElement = document.getElementById('app');
if (rootElement == null) throw new Error("Couldn't find root element");
const root = createRoot(rootElement);

root.render(
  <Root config={gbifConfig}>
    <RouterProvider router={router} fallbackElement={null} />
  </Root>
);
