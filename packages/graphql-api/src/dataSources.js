const _ = require('lodash');

const api = _.merge(
  require('./resources/dataset').dataSource,
  require('./resources/organization').dataSource,
  require('./resources/taxon').dataSource,
  require('./resources/network').dataSource,
  require('./resources/installation').dataSource,
  require('./resources/node').dataSource,
  require('./resources/participant').dataSource,
  require('./resources/occurrence').dataSource,
  require('./util/wikidata/').dataSource,
  require('./resources/collection').dataSource,
  require('./resources/institution').dataSource,
  require('./resources/person').dataSource,
// -- Add imports above this line (required by plopfile.js) --
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
// TODO perhaps we should add an alert of keys are used twice
module.exports = {
  api
};