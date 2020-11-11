/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    staffMemberSearch: (parent, args, { dataSources }) =>
      dataSources.staffMemberAPI.searchStaff({query: args}),
      staffMember: (parent, { key }, { dataSources }) =>
      dataSources.staffMemberAPI.getStaffByKey({ key })
  },
  StaffMember: {
    primaryCollection: ({ primaryCollectionKey: key }, args, { dataSources }) => {
       if (typeof key === 'undefined') return null;
       dataSources.collectionAPI.getCollectionByKey({ key })
    },
    primaryInstitution: ({ primaryInstitutionKey: key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      dataSources.institutionAPI.getInstitutionByKey({ key })
   },
  }
};