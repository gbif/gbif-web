import gql from "graphql-tag";

const typeDef = gql`
  extend type Query {
    notification(id: String!): Notification
  }

  type Notification {
    id: ID
    title: String
    summary: String
    body: String
    excerpt: String
    start: DateTime
    end: DateTime
    url: String
    notificationType: String
    severity: String
    createdAt: DateTime!
    updatedAt: DateTime
  }
`;

export default typeDef;