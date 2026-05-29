import { RESTDataSource as ApolloRESTDataSource } from '@apollo/datasource-rest';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';

// A single shared HTTP response cache across all data source instances and
// requests. apollo-datasource-rest v3 used to share the server cache that was
// injected through `initialize({ cache })`; @apollo/datasource-rest v6 instead
// gives every instance its own in-memory cache unless one is provided. We keep
// a process-wide shared cache to preserve the previous cross-request caching.
const sharedHttpCache = new InMemoryLRUCache();

/**
 * Local base class that adapts the v3 `apollo-datasource-rest` conventions used
 * throughout this codebase to the v6 `@apollo/datasource-rest` API, so the
 * individual resource data sources need only trivial changes.
 *
 * What this shim hides:
 *  - v6 helper methods take a single options object: `get(path, { params, ... })`.
 *    Our resources call the v3 form `get(path, params, init)` where `params` is
 *    usually a pre-serialized query string (from `qs.stringify`).
 *  - v6 removed the `initialize({ context, cache })` lifecycle hook and the
 *    `this.context` it set. We re-add a compatible `initialize({ context })`
 *    that the Apollo `context` function calls per request (see src/index.ts),
 *    so existing `this.context.*` usage keeps working unchanged.
 */
export class RESTDataSource extends ApolloRESTDataSource {
  constructor(options = {}) {
    super({ cache: sharedHttpCache, ...options });
  }

  // Re-implements the v3 lifecycle hook. Called manually from the Apollo
  // `context` function for every request so `this.context` is available in
  // `willSendRequest` and the resolver-facing methods.
  initialize(config = {}) {
    this.context = config.context;
  }

  // Replicate apollo-datasource-rest v3 URL resolution. v6 simply does
  // `new URL(path, baseURL)`, which drops any path on the baseURL when `path`
  // starts with `/` (e.g. baseURL `https://api.gbif.org/v1` + `/dataset/x`
  // would resolve to `https://api.gbif.org/dataset/x`). v3 instead ensured a
  // trailing slash on the baseURL and stripped the leading slash from the path,
  // which is what all our data sources rely on.
  resolveURL(path, _request) {
    if (!this.baseURL) return new URL(path);
    const normalizedBaseURL = this.baseURL.endsWith('/')
      ? this.baseURL
      : `${this.baseURL}/`;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return new URL(normalizedPath, normalizedBaseURL);
  }

  // Convert the legacy `(params, init)` arguments into a v6 request options
  // object. `params` may be a query string, a plain object or URLSearchParams.
  // eslint-disable-next-line class-methods-use-this
  buildRequest(params, init = {}) {
    const request = { ...(init || {}) };
    if (params !== undefined && params !== null && params !== '') {
      request.params =
        typeof params === 'string' ? new URLSearchParams(params) : params;
    }
    return request;
  }

  get(path, params, init) {
    return super.get(path, this.buildRequest(params, init));
  }

  post(path, body, init) {
    return super.post(path, { ...this.buildRequest(undefined, init), body });
  }

  put(path, body, init) {
    return super.put(path, { ...this.buildRequest(undefined, init), body });
  }

  patch(path, body, init) {
    return super.patch(path, { ...this.buildRequest(undefined, init), body });
  }

  delete(path, params, init) {
    return super.delete(path, this.buildRequest(params, init));
  }
}

export default RESTDataSource;
