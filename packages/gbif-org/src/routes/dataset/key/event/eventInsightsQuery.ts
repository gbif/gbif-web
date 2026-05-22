// Shared occurrence-insights query used by both sampling-event and
// inferred-from-occurrence event detail views to summarise the occurrences
// that belong to an event.
export const EVENT_INSIGHTS_QUERY = /* GraphQL */ `
  query EventInsights(
    $imagePredicate: Predicate
    $coordinatePredicate: Predicate
    $taxonPredicate: Predicate
    $yearPredicate: Predicate
    $datasetPredicate: Predicate
  ) {
    unfiltered: occurrenceSearch(predicate: $datasetPredicate) {
      documents(size: 0) {
        total
      }
      cardinality {
        eventId
      }
      facet {
        dwcaExtension {
          key
          count
        }
      }
    }
    images: occurrenceSearch(predicate: $imagePredicate) {
      documents(size: 10) {
        total
        results {
          key
          stillImages {
            identifier: thumbor(height: 400)
          }
        }
      }
    }
    withCoordinates: occurrenceSearch(predicate: $coordinatePredicate) {
      documents(size: 10) {
        total
      }
    }
    withTaxonMatch: occurrenceSearch(predicate: $taxonPredicate) {
      documents(size: 10) {
        total
      }
    }
    withYear: occurrenceSearch(predicate: $yearPredicate) {
      documents(size: 10) {
        total
      }
    }
  }
`;
