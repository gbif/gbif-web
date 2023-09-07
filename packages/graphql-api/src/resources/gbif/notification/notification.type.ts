import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        notification(id: String!): Notification!
    }

    type Notification {
        id: ID!
        title: String!
        summary: String
        body: String
        start: String!
        end: String!
        url: String
        notificationType: String!
        severity: String!
    }
`;

export default typeDef;