import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    userValidations(limit: Int, offset: Int): ValidationListResults!
      @cacheControl(maxAge: 0, scope: PRIVATE)
  }

  type ValidationListResults {
    results: [Validation!]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Validation {
    key: String!
    created: DateTime
    modified: DateTime
    username: String
    file: String
    fileFormat: String
    status: String
    metrics: ValidationMetrics
  }

  type ValidationMetrics {
    indexeable: Boolean
  }
`;

export default typeDef;
