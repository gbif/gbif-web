const _ = require('lodash');
const TaxonApi = require('./taxon.source');

module.exports = {
  resolver: _.merge({}, require('./taxon.resolver'), require('./taxonDetails.resolver')),
  typeDef: [require('./taxon.type'), require('./taxonDetails.type')],
  dataSource: {
    taxonAPI: TaxonApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};