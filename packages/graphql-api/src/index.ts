import express from 'express';
import cors from 'cors';
import compression from 'compression';
// recommended in the apollo docs https://github.com/stems/graphql-depth-limit
import depthLimit from 'graphql-depth-limit';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { expressMiddleware } from '@apollo/server/express4';
import { get } from 'lodash';

// Local imports
import config from './config';
import { hashMiddleware, graphqlExplorer } from './middleware';
import health from './health';
// get the full schema of what types, enums, scalars and queries are available
import getSchema from './typeDefs';
// define how to resolve the various types, fields and queries
import resolvers from './resolvers';
// we will attach a user if an authorization header is present.
import mapController from './api-utils/maps/index.ctrl.js';
import ipController from './api-utils/ip2country.ctrl.js';
import polygonName from './api-utils/polygonName.ctrl.js';
import suggestFilter from './api-utils/suggestFilter.ctrl.js';
import formController from './api-utils/forms/index.ctrl';
import geometryController from './api-utils/geometry/index.ctrl.js';
import { loggingPlugin } from './plugins/loggingPlugin';
import extractUser from './helpers/auth/extractUser';
import { Context } from './context';

// we are doing this async as we need to load the various enumerations from the APIs
// and generate the schema from those
async function initializeServer() {
  // this is async as we generate parts of the schema from the live enumeration API
  const typeDefs = await getSchema();
  const server = new ApolloServer<Context>({
    includeStacktraceInErrorResponses: config.debug,
    typeDefs,
    resolvers,
    validationRules: [depthLimit(14)], // this likely have to be much higher than 6, but let us increase it as needed and not before
    plugins: [
      ApolloServerPluginCacheControl({
        defaultMaxAge: config.debug ? 0 : 600,
      }),
      loggingPlugin,
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
  app.use(express.json({limit: '1mb'}));

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

  mapController(app);
  ipController(app);
  polygonName(app);
  formController(app);
  suggestFilter(app);
  geometryController(app);

  await server.start();
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const user = await extractUser(get(req, 'headers.authorization'));
      return new Context({ user, req, server })
    },
  }));

  app.listen({ port: config.port }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${config.port}/graphql`,
    ),
  );
}

initializeServer();
