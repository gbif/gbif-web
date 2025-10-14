import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { get } from 'lodash';
import { setMaxListeners } from 'node:events';
// recommended in the apollo docs https://github.com/stems/graphql-depth-limit
import depthLimit from 'graphql-depth-limit';

// Local imports
import config from './config';
import health from './health';
import { graphqlExplorer, hashMiddleware } from './middleware';
// get the full schema of what types, enums, scalars and queries are available
import getSchema from './typeDefs';
// define how to resolve the various types, fields and queries
import resolvers from './resolvers';
// how to fetch the actual data and possible format/remap it to match the schemas
import api from './dataSources';
// we will attach a user if an authorization header is present.
import feedbackController from './api-utils/forms/feedback';
import citesController from './api-utils/cites.ctrl';
import formController from './api-utils/forms/index.ctrl';
import geometryController from './api-utils/geometry/index.ctrl.js';
import helperController from './api-utils/helpers.ctrl.js';
import mcpController from './mcp/routes.ctrl.js';
import mcpController2 from './mcp/test.ctrl.js';
import ipController from './api-utils/ip2country.ctrl.js';
import mapController from './api-utils/maps/index.ctrl.js';
import polygonName from './api-utils/polygonName.ctrl.js';
import sourceArchiveCtrl from './api-utils/sourceArchive.ctrl.js';
import suggestFilter from './api-utils/suggestFilter.ctrl.js';
import extractUser from './helpers/auth/extractUser';
import { explicitNoCacheWhenErrorsPlugin } from './plugins/explicitNoCacheWhenErrorsPlugin';
import headerBasedCachePlugin from './plugins/headerBasedCachePlugin';
import loggingPlugin from './plugins/loggingPlugin';

// we are doing this async as we need to load the various enumerations from the APIs
// and generate the schema from those
async function initializeServer() {
  // this is async as we generate parts of the schema from the live enumeration API
  const typeDefs = await getSchema();
  const server = new ApolloServer({
    cache: new InMemoryLRUCache(),
    debug: config.debug,
    context: async ({ req, res }) => {
      // on all requests attach a user if present
      const user = await extractUser(get(req, 'headers.authorization'));
      if (user) {
        // it isn't possible to set cache headers on the response object here as the cache control headers will be overwritten by the apollo cache plugin
        // res.header(
        //   'Cache-Control',
        //   'private, no-cache, no-store, must-revalidate',
        // );
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.header('Surrogate-Control', 'no-store');
      }

      // Add express context and a listener for aborted connections. Then data sources have a chance to cancel resources
      // I haven't been able to find any examples of people doing anything with cancellation - which I find odd.
      // Perhaps the overhead isn't worth it in most cases?
      const controller = new AbortController();
      // Default is 10, we exceed this sometimes with nested resolves that utilize cancellation
      setMaxListeners(50, controller.signal);
      if (req) {
        req.on('close', () => {
          controller.abort();
        });
      }

      return {
        user,
        abortController: controller,
        userAgent: get(req, 'headers.User-Agent') || 'GBIF_GRAPHQL_API',
        // we could also forward the full header I suppose. For now it is just the referer
        referer: get(req, 'headers.referer') || null,
        locale: get(req, 'headers.locale') || 'en-GB',
        preview: get(req, 'headers.preview') === 'true',
        queryId: res ? res.get('X-Graphql-query-ID') : null,
        variablesId: res ? res.get('X-Graphql-variables-ID') : null,
      };
    },
    typeDefs,
    resolvers,
    dataSources: () =>
      Object.keys(api).reduce(
        (prev, cur) => ({
          ...prev,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [cur]: new (api as { [key: string]: any })[cur](config),
        }),
        {},
      ), // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
    validationRules: [depthLimit(14)], // this likely have to be much higher than 6, but let us increase it as needed and not before
    plugins: [
      ApolloServerPluginCacheControl({
        defaultMaxAge: config.debug ? 0 : 603,
      }),
      loggingPlugin,
      headerBasedCachePlugin,
      explicitNoCacheWhenErrorsPlugin,
    ],
    logger: console,
  });

  const app = express();
  app.use(compression());
  app.use(
    cors({
      methods: 'GET,POST,OPTIONS',
    }),
  );
  app.use(express.static('public'));
  app.use(bodyParser.json({ limit: '1mb' }));

  // extract query and variables from store if a hash is provided instead of a query or variable
  // app.use(hashMiddleware);
  app.get('/graphql', hashMiddleware);
  app.post('/graphql', hashMiddleware);

  // serve the graphql explorer
  app.get('/graphql', graphqlExplorer);

  // link to query and variables
  app.get('/getIds', (req, res) => {
    res.json({
      queryId: res.get('X-Graphql-query-ID'),
      variablesId: res.get('X-Graphql-variables-ID'),
    });
  });

  app.get('/health', health);

  await server.start();
  server.applyMiddleware({ app });
  feedbackController(app);
  mapController(app);
  ipController(app);
  polygonName(app);
  formController(app);
  suggestFilter(app);
  geometryController(app);
  helperController(app, server);
  sourceArchiveCtrl(app);
  citesController(app);
  mcpController(app);
  mcpController2(app);
  app.listen({ port: config.port }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`,
    ),
  );
}

initializeServer();
