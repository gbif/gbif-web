import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    userDerivedDataset(
      limit: Int
      offset: Int
      username: String!
    ): DerivedDatasetListResults! @cacheControl(maxAge: 0, scope: PRIVATE)
  }

  type DerivedDatasetListResults {
    results: [DerivedDataset!]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DerivedDataset {
    doi: String
    description: String
    citation: String
    title: String
    sourceUrl: String
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
  }
`;

export default typeDef;
