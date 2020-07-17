const { URLResolver, DateTimeResolver, EmailAddressResolver, JSONResolver, GUIDResolver } = require('graphql-scalars');

module.exports = {
  JSON: JSONResolver, // last resort type for unstructured data
  URL: URLResolver, 
  DateTime: DateTimeResolver, 
  EmailAddress: EmailAddressResolver, 
  GUID: GUIDResolver
};