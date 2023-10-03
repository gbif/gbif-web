import { gql } from 'apollo-server';

const typeDef = gql`
    extend type Query {
        gbifDocument(id: String!, preview: Boolean): GbifDocument
    }

    type GbifDocument {
        id: ID
        createdAt: DateTime
        document: Document
        title: String
        updatedAt: DateTime
        summary: String
        primaryLink: Link
        body: String
        previewText: String
        citation: String
        keywords: [String]
    }
`;

export default typeDef;