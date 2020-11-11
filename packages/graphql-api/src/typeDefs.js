const { gql } = require('apollo-server');
const _ = require('lodash');
const { getEnumTypeDefs } = require('./enums');

async function getSchema() {
  // create a string with all the enum options (loaded from the API)
  const enumsSchema = await getEnumTypeDefs();

  const rootQuery = gql`
    ${enumsSchema}

    type Query {
      """
      _empty is nonsense, and only here as we are not allowed to extend an empty type.
      """
      _empty: String
    }
  `;

  const typeDefs = _.flatten([
    rootQuery,
    require('./input'),
    require('./resources/misc/comment'),
    require('./resources/misc/contact'),
    require('./resources/misc/endpoint'),
    require('./resources/misc/identifier'),
    require('./resources/misc/machineTag'),
    require('./resources/misc/tag'),
    require('./resources/misc/address'),
    require('./resources/dataset').typeDef,
    require('./resources/organization').typeDef,
    require('./resources/scalars').typeDef,
    require('./resources/taxon').typeDef,
    require('./resources/network').typeDef,
    require('./resources/installation').typeDef,
    require('./resources/node').typeDef,
    require('./resources/participant').typeDef,
    require('./resources/occurrence').typeDef,
    require('./util/wikidata').typeDef,
    require('./resources/collection').typeDef,
    require('./resources/institution').typeDef,
    require('./resources/staffMember').typeDef,
    require('./resources/external/orcid').typeDef,
    require('./resources/external/viaf').typeDef,
// -- Add imports above this line (required by plopfile.js) --
  ]);

  return typeDefs;
}

module.exports = {
  getSchema
};