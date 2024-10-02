import gql from "graphql-tag";
import { SEARCH_RESULT_OPTIONS } from './resourceSearch.constants';

const typeDef = gql`
  extend type Query {
    resourceSearch(input: ResourceSearchInput): PaginatedSearchResult
  }

  input ResourceSearchInput {
    q: String
    limit: Int
    offset: Int
    contentType: [ContentType!]
    id: [ID!]
    locale: [String!]
    topics: [String!]
    countriesOfCoverage: [String!]
    countriesOfResearcher: [String!]
    sortBy: ResourceSortBy
    sortOrder: ResourceSortOrder
    start: String
  }

  enum ResourceSortOrder {
    desc
    asc
  }

  enum ResourceSortBy {
    createdAt
    start
    end
  }

  union SingleSearchResult = ${SEARCH_RESULT_OPTIONS.map(option => option.graphQLType).join(' | ')}

  enum ContentType {
    ${SEARCH_RESULT_OPTIONS.map(option => option.enumContentType).join('\n')}
  }

  type PaginatedSearchResult {
    results: [SingleSearchResult]
    limit: Int
    offset: Int
    count: Int
    endOfRecords: Boolean
  }
`;

export default typeDef;