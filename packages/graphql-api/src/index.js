const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const get = require('lodash/get');
const config = require('./config');
const { hashMiddleware } = require('./hashMiddleware');

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
    debug: true,
    context: async ({ req }) => {
      // on all requests attach a user if present
      const user = await extractUser(get(req, 'headers.authorization'));
      return { user };
    },
    typeDefs,
    resolvers,
    dataSources: () => api,
    validationRules: [depthLimit(10)], // this likely have to be much higher than 6, but let us increase it as needed and not before
    cacheControl: {
      defaultMaxAge: 600,
      scope: 'public',
    },
  });

  const app = express();
  app.use(bodyParser.json());

  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // Pass to next layer of middleware
    next();
  });

  // extract query and variables from store if a hash is provided instead of a query or variable
  app.use(hashMiddleware)

  server.applyMiddleware({ app });

  app.listen({ port: config.port }, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`)
  );
}

initializeServer();