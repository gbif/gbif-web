import { gql } from "apollo-server";

export type Notification = {
    title: string;
    summary?: string;
    body?: string;
    start: Date;
    end: Date;
    url?: string;
    notificationType: string;
    severity: string;
}

const typeDef = gql`
    extend type Query {
        notification(id: String!): Notification!
    }

    type Notification {
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