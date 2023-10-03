const { gql } = require("apollo-server-core");

const typeDef = gql`
    extend type Query {
        article(id: String!, preview: Boolean): Article
    }

    type Article {
        id: ID
        title: String
        summary: String
        body: String
        previewText: String
        primaryImage: Image
        secondaryLinks: [Link]
        urlAlias: String
        documents: [Document]
        createdAt: DateTime
        updatedAt: DateTime
        displayDate: Boolean
        articleType: String
        audiences: [String]
        keywords: [String]
        purposes: [String]
        topics: [String]
    }
`;

export default typeDef;