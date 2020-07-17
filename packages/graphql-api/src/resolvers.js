const _ = require('lodash');

const resolvers = _.merge(
  require('./resources/scalars').resolver,
  require('./resources/dataset').resolver,
  require('./resources/organization').resolver,
  require('./resources/taxon').resolver,
  require('./resources/network').resolver,
  require('./resources/installation').resolver,
  require('./resources/node').resolver,
  require('./resources/participant').resolver,
  require('./resources/occurrence').resolver,
  require('./util/wikidata').resolver,
  require('./resources/collection').resolver,
  require('./resources/institution').resolver,
  require('./resources/person').resolver,
// -- Add imports above this line (required by plopfile.js) --
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
// TODO perhaps we should add an alert of keys are used twice
module.exports = {
  resolvers
};