const OMNI_SEARCH = /* GraphQL */ `
  query OmniSearch(
    $resourcePredicate: Predicate
    $resourceKeywordPredicate: Predicate
    $taxonQuery: TaxonSearchInput
    $datasetQuery: DatasetSearchInput
    $q: String!
  ) {
    organizationSearch(isEndorsed: true, q: $q, limit: 3) {
      limit
      count
      offset
      results {
        key
        title
        created
        country
        logoUrl
        excerpt
      }
    }
    datasetSearch(query: $datasetQuery) {
      count
      limit
      offset
      results {
        ...DatasetStubResult
      }
    }
    taxonSearch(query: $taxonQuery, limit: 3) {
      count
      offset
      endOfRecords
      results {
        ...TaxonResult
        acceptedTaxon {
          ...TaxonResult
        }
      }
    }

    resourceSearch(predicate: $resourcePredicate) {
      documents(size: 5) {
        from
        size
        total
        results {
          __typename
          ... on Composition {
            ...CompositionResult
          }
          ... on Article {
            ...ArticleResult
          }
          ... on News {
            ...NewsResult
          }
          ... on DataUse {
            ...DataUseResult
          }
          ... on MeetingEvent {
            ...EventResult
          }
          ... on GbifProject {
            ...ProjectResult
          }
          ... on Programme {
            ...ProgrammeResult
          }
          ... on Tool {
            ...ToolResult
          }
          ... on Document {
            ...DocumentResult
          }
          ... on NetworkProse {
            ...NetworkProseResult
          }
        }
      }
    }

    resourceKeywordSearch: resourceSearch(predicate: $resourceKeywordPredicate) {
      documents(size: 5) {
        from
        size
        total
        results {
          __typename
          ... on Composition {
            ...CompositionResult
          }
          ... on Article {
            ...ArticleResult
          }
          ... on News {
            ...NewsResult
          }
          ... on DataUse {
            ...DataUseResult
          }
          ... on MeetingEvent {
            ...EventResult
          }
          ... on GbifProject {
            ...ProjectResult
          }
          ... on Programme {
            ...ProgrammeResult
          }
          ... on Tool {
            ...ToolResult
          }
          ... on Document {
            ...DocumentResult
          }
          ... on NetworkProse {
            ...NetworkProseResult
          }
        }
      }
    }
  }
`;

export default OMNI_SEARCH;
