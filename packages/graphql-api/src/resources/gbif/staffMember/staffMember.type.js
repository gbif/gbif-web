import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    staffMemberSearch(
      limit: Int
      offset: Int
      q: String
      primaryInstitution: GUID
      primaryCollection: GUID
    ): StaffMemberSearchResults
    staffMember(key: String!): StaffMember
  }

  type StaffMemberSearchResults {
    results: [StaffMember]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type StaffMember {
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
    primaryInstitution: Institution
    primaryCollectionKey: GUID
    primaryCollection: Collection
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

export default typeDef;
