import config from './config';
import api from './dataSources';

/**
 * Builds the per-request GraphQL context: the provided base fields plus a fresh,
 * initialized set of data sources.
 *
 * apollo-server v3 used to create data sources (via the `dataSources` option)
 * and call their `initialize({ context, cache })` automatically. That option was
 * removed in Apollo Server 4+, so we now build the data sources ourselves inside
 * the context function and call our compatibility `initialize` (see
 * src/RESTDataSource.js) so existing `this.context.*` usage keeps working.
 *
 * Used both by the Express `expressMiddleware` context function (src/index.ts)
 * and by internal `server.executeOperation` calls, which in v4+ no longer run
 * the context function and therefore need a context supplied explicitly.
 */
export default function createContext(baseContext = {}) {
  const context = { ...baseContext };

  // Every request gets its own data source instances.
  // See https://github.com/apollographql/apollo-server/issues/1562
  context.dataSources = Object.keys(api).reduce((acc, key) => {
    acc[key] = new api[key](config);
    return acc;
  }, {});

  // Initialize after attaching `dataSources` so that `this.context` mirrors the
  // full context object that resolvers receive (matching apollo-server v3).
  Object.values(context.dataSources).forEach((dataSource) => {
    if (dataSource && typeof dataSource.initialize === 'function') {
      dataSource.initialize({ context });
    }
  });

  return context;
}
