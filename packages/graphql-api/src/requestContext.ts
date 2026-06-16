import { AsyncLocalStorage } from 'async_hooks';

// Fields attached to every log line emitted while handling a request.
export type RequestLogContext = {
  // Correlates all logs for one request. Reused from upstream x-request-id if present.
  requestId?: string;
  // The page URL that issued the request (x-gbif-site-url header).
  siteUrl?: string | null;
};

// Opened per request by the middleware in index.ts; merged into logs by logger.ts.
export const requestContextStorage = new AsyncLocalStorage<RequestLogContext>();

export function getRequestLogContext(): RequestLogContext | undefined {
  return requestContextStorage.getStore();
}
