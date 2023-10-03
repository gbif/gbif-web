import { gql } from "apollo-server-core";
import { SEARCH_RESULT_OPTIONS } from './resourceSearch.constants';

const typeDef = gql`
    extend type Query {
        resourceSearch(input: ResourceSearchInput!): PaginatedSearchResult
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

    # You must update SingleSearchResult.__resolveType in './resourceSearch.resolver.js' when adding new types
    union SingleSearchResult = ${Object.values(SEARCH_RESULT_OPTIONS).join(' | ')}

    type PaginatedSearchResult {
        results: [SingleSearchResult]
        limit: Int
        offset: Int
        count: Int
        endOfRecords: Boolean
    }
`;

export default typeDef;