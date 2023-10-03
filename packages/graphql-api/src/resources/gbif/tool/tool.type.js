import { gql } from 'apollo-server';

const typeDef = gql`
    extend type Query {
        tool(id: String!, preview: Boolean): Tool
    }

    type Tool {
        id: ID
        title: String
        summary: String
        body: String
        previewText: String
        primaryImage: Image
        primaryLink: Link
        createdAt: DateTime
        updatedAt: DateTime
        keywords: [String]
        author: String
        rights: String
        publicationDate: DateTime
        rightsHolder: String
        citation: String
        machineIdentifier: String
        secondaryLinks: [Link]
    }
`;

export default typeDef;