const TaxonApi = require('./taxon.source');

module.exports = {
  resolver: require('./taxon.resolver'),
  typeDef: [require('./taxon.type'), require('./taxonDetails.type')],
  dataSource: {
    taxonAPI: new TaxonApi()
  }
};