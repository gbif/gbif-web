import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    installationSearch(
      limit: Int
      offset: Int
      q: String
      identifier: String
      identifierType: IdentifierType
      type: String
      machineTagNamespace: String
      machineTagName: String
      machineTagValue: String
    ): InstallationSearchResults
    installation(key: ID!): Installation
  }

  type InstallationSearchResults {
    results: [Installation!]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Installation {
    key: ID!
    comments: [Comment]
    contacts: [Contact!]
    created: DateTime
    createdBy: String
    deleted: DateTime
    description: String
    disabled: Boolean
    endpoints: [Endpoint]
    identifiers: [Identifier]
    machineTags: [MachineTag]
    modified: DateTime
    modifiedBy: String
    organizationKey: ID
    """
    The homepage is a computed field that is only available for IPT_INSTALLATION types and extracted from the endpoints
    """
    homepage: String
    tags: [Tag]
    title: String
    type: String

    organization: Organization
    dataset(limit: Int, offset: Int): DatasetListResults!
  }
`;

export default typeDef;
