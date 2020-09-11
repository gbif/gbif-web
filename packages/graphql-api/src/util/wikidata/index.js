const WikiDataApi = require('./wikidata.source');

module.exports = {
  resolver: require('./wikidata.resolver'),
  typeDef: require('./wikidata.type'),
  dataSource: {
    wikidataAPI: WikiDataApi
  }
};