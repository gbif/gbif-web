const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    institutionSearch(
      limit: Int, 
      offset: Int, 
      q: String,
      contact: ID,
      code: String,
      name: String,
      alternativeCode: String
      ): InstitutionSearchResults
    institution(key: String!): Institution
  }

  type InstitutionSearchResults {
    results: [Institution]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Institution {
    key: ID!
    code: String
    name: String
    description: String
    type: InstitutionType
    active: Boolean
    email: [EmailAddress]
    phone: [String]
    homepage: URL
    catalogUrl: URL
    apiUrl: URL
    institutionalGovernance: InstitutionGovernance
    disciplines: [Discipline]
    latitude: Float
    longitude: Float
    mailingAddress: Address
    address: Address
    additionalNames: [String]
    foundingDate: DateTime
    geographicDescription: String
    taxonomicDescription: String
    numberSpecimens: Int
    indexHerbariorumRecord: Boolean
    logoUrl: URL
    citesPermitNumber: String
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    deleted: DateTime
    tags: [Tag]
    identifiers: Identifier
    contacts: [StaffMember]
    machineTags: [MachineTag]
    alternativeCodes: [AlternativeCode]
    comments: [Comment]
    collections: [Collection]
  }
`;

module.exports = typeDef;