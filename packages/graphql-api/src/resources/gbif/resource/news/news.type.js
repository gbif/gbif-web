import { gql } from 'apollo-server';

const typeDef = gql`
    extend type Query {
        news(id: String!, preview: Boolean): News
    }

    type News {
        id: ID
        gbifHref: String
        title: String
        summary: String
        body: String
        excerpt: String
        primaryImage: Image
        primaryLink: Link
        secondaryLinks: [Link]
        citation: String
        countriesOfCoverage: [String]
        topics: [String]
        purposes: [String]
        audiences: [String]
        keywords: [String]
        searchable: Boolean
        homepage: Boolean
        gbifRegion: [GbifRegion]
        createdAt: DateTime
        updatedAt: DateTime
        programmeTag: [String]
        projectTag: [String]
    }
`;

export default typeDef;