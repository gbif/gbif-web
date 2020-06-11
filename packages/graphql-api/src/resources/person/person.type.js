const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    personSearch(
      limit: Int, 
      offset: Int, 
      q: String
      ): PersonSearchResults
    person(key: String!): Person
  }

  type PersonSearchResults {
    results: [Person]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Person {
    key: ID!
    firstName: String
    lastName: String
    position: String
    areaResponsibility: String
    researchPursuits: String
    phone: String
    fax: String
    email: EmailAddress
    mailingAddress: Address
    primaryInstitutionKey: GUID
    primaryCollectionKey: GUID
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    deleted: DateTime
    tags: [Tag]
    machineTags: [MachineTag]
    identifiers: [Identifier]
    comments: [Comment]
  }
`;

module.exports = typeDef;