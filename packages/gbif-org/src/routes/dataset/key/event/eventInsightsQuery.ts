// Occurrence-insights query used by both sampling-event and
// inferred-from-occurrence event detail views to summarise the occurrences
// that belong to an event. Kept lean — total + sample images — because the
// coordinate / year / taxon-match facets are too expensive to run per-event on
// event-heavy datasets.
export const EVENT_INSIGHTS_QUERY = /* GraphQL */ `
  query EventInsights($datasetPredicate: Predicate, $imagePredicate: Predicate) {
    unfiltered: occurrenceSearch(predicate: $datasetPredicate) {
      documents(size: 0) {
        total
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
  }
`;
