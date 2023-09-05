import { gql } from 'apollo-server';

export type News = {
    title: string;
    summary?: string;
    body?: string;
    // Id of contentful Asset entry
    primaryImageId?: string;
    primaryLink?: string;
    secondaryLinks: string[];
    citation?: string;
    // Ids of contentful Country entries
    countriesOfCoverageIds: string[];
    // Ids of contentful Topic entries
    topicIds: string[];
    // Ids of contentful Purpose entries
    purposes: string[];
    // Ids of contentful Audience entries
    audiences: string[];
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}

const typeDef = gql`
    extend type Query {
        news(id: String!): News!
    }

    type News {
        title: String!
        summary: String
        body: String
        primaryImageId: String
        primaryLink: String
        secondaryLinks: [String]
        citation: String
        countriesOfCoverageIds: [String]
        topicIds: [String]
        purposes: [String]
        audiences: [String]
        keywords: [String]
        searchable: Boolean
        homepage: Boolean
    }
`;

export default typeDef;