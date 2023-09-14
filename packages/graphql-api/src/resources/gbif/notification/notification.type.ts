import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        notification(id: String!, preview: Boolean): Notification!
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