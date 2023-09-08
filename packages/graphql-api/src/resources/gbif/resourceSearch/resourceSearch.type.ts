import { ElasticSearchMapperResult } from "#/helpers/contentful/ElasticSearchService";
import { gql } from "apollo-server-core";

export type PaginatedSearchResult = {
    results: ElasticSearchMapperResult[]
    limit: number
    offset: number
    count: number
    endOfRecords: boolean
}

const typeDef = gql`
    extend type Query {
        resourceSearch(input: SearchInput!): PaginatedSearchResult!
    }

    input SearchInput {
        q: String
        from: Int
        contentType: String
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