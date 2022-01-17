const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const AbortController = require('abort-controller');
const get = require('lodash/get');
const config = require('./config');
const { hashMiddleware } = require('./hashMiddleware');
const { injectQuery } = require('./injectQueryMiddleware');
const health = require('./health')

const bodyParser = require('body-parser');

// recommended in the apollo docs https://github.com/stems/graphql-depth-limit
const depthLimit = require('graphql-depth-limit');
// get the full schema of what types, enums, scalars and queries are available
const { getSchema } = require('./typeDefs');
// define how to resolve the various types, fields and queries
const { resolvers } = require('./resolvers');
// how to fetch the actual data and possible format/remap it to match the schemas
const { api } = require('./dataSources');
// we will attach a user if an authorization header is present.
const extractUser = require('./auth/extractUser');

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
      const controller = new AbortController();
      req.on('close', function () {
        controller.abort();
      });

      return { user, abortController: controller };
    },
    typeDefs,
    resolvers,
    dataSources: () => Object.keys(api).reduce((a, b) => (a[b] = new api[b](), a), {}), // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562  
    validationRules: [depthLimit(14)], // this likely have to be much higher than 6, but let us increase it as needed and not before
    cacheControl: {
      defaultMaxAge: 600,
      scope: 'public',
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground
    ]
  });

  const app = express();
  app.use(compression());
  app.use(cors({
    methods: 'GET,POST,OPTIONS',
  }))
  app.use(bodyParser.json());

  // extract query and variables from store if a hash is provided instead of a query or variable
  app.use(hashMiddleware);

  // Add script tag to playground with linked query
  app.use(injectQuery);

  // link to query and variables
  app.get('/getIds', function (req, res) {
    res.json({
      queryId: res.get('X-Graphql-query-ID'),
      variablesId: res.get('X-Graphql-variables-ID')
    });
  });

  app.get('/health', health);

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: config.port }, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`)
  );
}

initializeServer();