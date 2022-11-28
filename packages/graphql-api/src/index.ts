import express from 'express';
import cors from 'cors';
import compression from 'compression';
import glob from 'glob';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginCacheControl,
} from 'apollo-server-core';
import AbortControllerServer from 'abort-controller';
import { get } from 'lodash';
import bodyParser from 'body-parser';
// recommended in the apollo docs https://github.com/stems/graphql-depth-limit
import depthLimit from 'graphql-depth-limit';

// Local imports
import config from './config';
import { hashMiddleware, injectQuery } from './middleware';
import health from './health';
// get the full schema of what types, enums, scalars and queries are available
import getSchema from './typeDefs';
// define how to resolve the various types, fields and queries
import resolvers from './resolvers';
// how to fetch the actual data and possible format/remap it to match the schemas
import api from './dataSources';
// we will attach a user if an authorization header is present.
import extractUser from './helpers/auth/extractUser';
import mapController from './api-utils/maps/index.ctrl.js';

// we are doing this async as we need to load the various enumerations from the APIs
// and generate the schema from those
async function initializeServer() {
  // this is async as we generate parts of the schema from the live enumeration API
  const typeDefs = await getSchema();
  const server = new ApolloServer({
    debug: config.debug,
    context: async ({ req }) => {
      // on all requests attach a user if present
      const user = await extractUser(get(req, 'headers.authorization'));

      // Add express context and a listener for aborted connections. Then data sources have a chance to cancel resources
      // I haven't been able to find any examples of people doing anything with cancellation - which I find odd.
      // Perhaps the overhead isn't worth it in most cases?
      const controller = new AbortControllerServer();
      req.on('close', () => {
        controller.abort();
      });

      return {
        user,
        abortController: controller,
        userAgent: get(req, 'headers.User-Agent') || 'GBIF_GRAPHQL_API',
        // we could also forward the full header I suppose. For now it is just the referer
        referer: get(req, 'headers.referer') || null,
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
      ApolloServerPluginLandingPageGraphQLPlayground,
      ApolloServerPluginCacheControl({
        defaultMaxAge: 600,
      }),
    ],
  });

  const app = express();
  app.use(compression());
  app.use(
    cors({
      methods: 'GET,POST,OPTIONS',
    }),
  );
  app.use(express.static('public'));
  app.use(bodyParser.json());

  // extract query and variables from store if a hash is provided instead of a query or variable
  // app.use(hashMiddleware);
  app.get('/graphql', hashMiddleware);
  app.post('/graphql', hashMiddleware);

  // Add script tag to playground with linked query
  // app.use(injectQuery);
  app.get('/graphql', injectQuery);
  app.post('/graphql', injectQuery);

  // link to query and variables
  app.get('/getIds', (req, res) => {
    res.json({
      queryId: res.get('X-Graphql-query-ID'),
      variablesId: res.get('X-Graphql-variables-ID'),
    });
  });

  app.get('/health', health);
  
  // utils for map styles
  mapController(app);

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: config.port }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`,
    ),
  );
}

initializeServer();
