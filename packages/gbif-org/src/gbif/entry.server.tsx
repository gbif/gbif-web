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
  const cacheControl = extractCacheControl(context?.loaderHeaders);

  return {
    appHtml,
    headHtml,
    htmlAttributes: helmet.htmlAttributes.toString(),
    bodyAttributes: helmet.bodyAttributes.toString(),
    statusCode: context.statusCode,
    cacheControl,
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

const allowedHeaders = {
  NONE: 'no-cache, no-store, must-revalidate', // no caching
  FLASH: 'public, max-age=30, must-revalidate', // short caching for dynamic content
  SHORT: 'public, max-age=60, must-revalidate', // short caching for dynamic content
};
const headerPriority = ['NONE', 'FLASH', 'SHORT'];

function extractCacheControl(routeHeaders: Record<string, Headers>) {
  // iterate over all routes and headers and find the most restrictive cache header.
  // the cache header used is GBIF-Cache-Control
  let shortestCacheHeader;
  for (const route in routeHeaders) {
    const headers = routeHeaders[route];
    const currentHeader = headers.get('GBIF-Cache-Control');
    if (
      currentHeader &&
      headerPriority.includes(currentHeader) &&
      allowedHeaders?.[currentHeader as keyof typeof allowedHeaders]
    ) {
      // select the shortest cache header
      if (
        !shortestCacheHeader ||
        headerPriority.indexOf(currentHeader) < headerPriority.indexOf(shortestCacheHeader)
      ) {
        shortestCacheHeader = currentHeader as keyof typeof allowedHeaders;
      }
    }
  }
  // get most restrictive cache header
  return shortestCacheHeader ? allowedHeaders[shortestCacheHeader] : undefined;
}
