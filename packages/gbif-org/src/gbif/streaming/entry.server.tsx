import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router-dom/server';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Root } from '@/components/Root';
import { gbifConfig } from '@/gbif/config';
import { configureGbifRoutes } from '../routes';
import { renderToPipeableStream } from 'react-dom/server';
import { Document } from './Document';

// Create routes based on config
const { routes, metadataRoutes } = configureGbifRoutes(gbifConfig);
const { query, dataRoutes } = createStaticHandler(routes);

export async function stream(req: ExpressRequest, res: ExpressResponse) {
  const fetchRequest = createFetchRequest(req);
  const context = await query(fetchRequest);

  // The context can be a Response object if any of the matched routes return or throw a redirect response
  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);

  const App = () => (
    <Document>
      <Root config={gbifConfig} metadataRoutes={metadataRoutes}>
        <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
      </Root>
    </Document>
  );

  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapModules: ['/entry.client.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res);
    },
  });
}

function createFetchRequest(req: ExpressRequest): Request {
  const origin = `${req.protocol}://${req.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  req.on('close', () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  return new Request(url.href, init);
}
