const { URLResolver, DateTimeResolver, EmailAddressResolver, JSONResolver } = require('graphql-scalars');

module.exports = {
  JSON: JSONResolver, // last resort type for unstructured data
  URL: URLResolver, 
  DateTime: DateTimeResolver, 
  EmailAddress: EmailAddressResolver, 
};