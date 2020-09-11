const PersonApi = require('./person.source');

module.exports = {
  resolver: require('./person.resolver'),
  typeDef: require('./person.type'),
  dataSource: {
    personAPI: PersonApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};