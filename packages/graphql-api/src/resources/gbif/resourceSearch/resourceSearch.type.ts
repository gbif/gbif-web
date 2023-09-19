import { ElasticSearchMapperResult } from "#/helpers/contentful/ContentfulSearchService";
import { gql } from "apollo-server-core";

export type PaginatedSearchResult = {
    results: ElasticSearchMapperResult[]
    limit: number
    offset: number
    count: number
    endOfRecords: boolean
}

export type ResourceSearchInput = {
    q?: string
    limit?: number
    offset?: number
    contentTypes?: string[]
    topics?: string[]
    countriesOfCoverage?: string[]
    countriesOfResearcher?: string[]
}

const typeDef = gql`
    extend type Query {
        resourceSearch(input: ResourceSearchInput!): PaginatedSearchResult!
    }

    input ResourceSearchInput {
        q: String
        limit: Int
        offset: Int
        contentTypes: [String!]
        topics: [String!]
        countriesOfCoverage: [String!]
        countriesOfResearcher: [String!]
    }

    union SingleSearchResult = DataUse | Event | Notification | News

    type PaginatedSearchResult {
        results: [SingleSearchResult!]!
        limit: Int!
        offset: Int!
        count: Int!
        endOfRecords: Boolean!
    }
`;

export default typeDef;