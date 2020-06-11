const PersonApi = require('./person.source');

module.exports = {
  resolver: require('./person.resolver'),
  typeDef: require('./person.type'),
  dataSource: {
    personAPI: new PersonApi()
  }
};