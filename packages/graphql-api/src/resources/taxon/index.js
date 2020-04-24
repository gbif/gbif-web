const _ = require('lodash');
const TaxonApi = require('./taxon.source');

module.exports = {
  resolver: _.merge({}, require('./taxon.resolver'), require('./taxonDetails.resolver')),
  typeDef: [require('./taxon.type'), require('./taxonDetails.type')],
  dataSource: {
    taxonAPI: new TaxonApi()
  }
};