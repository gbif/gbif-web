const StaffMemberApi = require('./staffMember.source');

module.exports = {
  resolver: require('./staffMember.resolver'),
  typeDef: require('./staffMember.type'),
  dataSource: {
    staffMemberAPI: StaffMemberApi // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  }
};