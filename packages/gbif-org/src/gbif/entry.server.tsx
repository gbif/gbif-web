import { Root } from '@/components/root';
import { gbifConfig } from '@/gbif/config';
import { createGbifRoutes } from '@/gbif/routes';
import type { Request as ExpressRequest } from 'express';
import ReactDOMServer from 'react-dom/server';
import { FilledContext, HelmetServerState } from 'react-helmet-async';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';

// Create routes based on config
const routes = createGbifRoutes(gbifConfig);
const { query, dataRoutes } = createStaticHandler(routes);

export async function render(req: ExpressRequest) {
  // Convert the Express request to a Fetch request
  // This is necessary because the query function expects a Fetch request
  const fetchRequest = createFetchRequest(req);
  const context = await query(fetchRequest);

  // The context can be a Response object if any of the matched routes return or throw a redirect response
  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);

  // Used to capture the head contents
  const helmetContext = {};

  const appHtml = ReactDOMServer.renderToString(
    <Root config={gbifConfig} helmetContext={helmetContext}>
      <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
    </Root>
  );

  const helmet = (helmetContext as FilledContext).helmet;
  const headHtml = createHeadHtml(helmet);

  return {
    appHtml,
    headHtml,
    htmlAttributes: helmet.htmlAttributes.toString(),
    bodyAttributes: helmet.bodyAttributes.toString(),
    statusCode: context.statusCode,
  };
}

function createHeadHtml(helmet: HelmetServerState) {
  return [
    helmet.title.toString(),
    helmet.priority.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ]
    .filter(Boolean)
    .join('\n');
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
