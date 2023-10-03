import { gql } from 'apollo-server';

const typeDef = gql`
    extend type Query {
        help(id: String!, preview: Boolean): Help
    }

    type Help {
        id: ID
        identifier: String
        title: String
        body: String
        previewText: String
        createdAt: DateTime
        updatedAt: DateTime
    }
`;

export default typeDef;