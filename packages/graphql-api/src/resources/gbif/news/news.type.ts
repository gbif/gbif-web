import { gql } from 'apollo-server';

const typeDef = gql`
    extend type Query {
        news(id: String!, preview: Boolean): News!
    }

    type News {
        id: ID!
        title: String!
        summary: String
        body: String
        previewText: String
        primaryImage: Image
        primaryLink: Link
        secondaryLinks: [Link]
        citation: String
        countriesOfCoverage: [String]
        topics: [String]
        purposes: [String]
        audiences: [String]
        keywords: [String]
        searchable: Boolean!
        homepage: Boolean!
    }
`;

export default typeDef;