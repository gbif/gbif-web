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

    resourceSearch(predicate: $resourcePredicate, q: $q, searchable: true) {
      documents(size: 5) {
        from
        size
        total
        results {
          ...ResourceSearchResult
        }
      }
    }

    resourceKeywordSearch: resourceSearch(
      predicate: $resourceKeywordPredicate
      q: $q
      searchable: true
    ) {
      documents(size: 5) {
        from
        size
        total
        results {
          ...ResourceSearchResult
        }
      }
    }
  }
`;

export default OMNI_SEARCH;
