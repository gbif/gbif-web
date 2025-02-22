import { gql } from 'apollo-server-core';
import { SEARCH_RESULT_OPTIONS } from './resourceSearch.constants';

const typeDef = gql`
  extend type Query {
    resourceSearch(
      size: Int
      from: Int
      predicate: Predicate
      q: String
      contentType: [ContentType!]
      topics: [String!]
      countriesOfCoverage: [String!]
      countriesOfResearcher: [String!]
      sortBy: ResourceSortBy
      sortOrder: ResourceSortOrder
      start: String
      id: [ID!]
      """
      Different from the locale header in that only translated resources will be returned
      """
      locale: [String!]
    ): ResourceSearchResult
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

  union Resource = ${SEARCH_RESULT_OPTIONS.map(
    (option) => option.graphQLType,
  ).join(' | ')}

  enum ContentType {
    ${SEARCH_RESULT_OPTIONS.map((option) => option.enumContentType).join('\n')}
  }

  type ResourceSearchResult {
    documents(size: Int, from: Int): ResourceDocuments!
    facet: ResourceFacet
    _predicate: JSON
    _meta: JSON
  }

  type ResourceFacet {
    countriesOfCoverage(size: Int, from: Int): [GenericFacetResult_string]
  }

  type ResourceDocuments {
    results: [Resource]!
    size: Int!
    from: Int!
    total: Long!
  }
`;

export default typeDef;
