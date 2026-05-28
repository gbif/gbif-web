import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    feedbackOptions(pageType: String!, key: ID!): FeedbackOptions
  }

  type FeedbackOptions {
    contactEmail: String
    contactName: String
    externalServiceName: String
    externalServiceUrl: String
  }
`;

export default typeDef;
