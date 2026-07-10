// Shared loader-side query used by the event detail dispatcher route.
// Returns the dataset type (so we can pick the right detail variant) along
// with the first occurrence for the requested event/parentEvent.
export const DATASET_EVENT_QUERY = /* GraphQL */ `
  query DatasetEvent($key: ID!, $limit: Int, $offset: Int, $eventID: ID, $optParentEventID: ID) {
    dataset(key: $key) {
      key
      type
      title
      samplingDescription {
        studyExtent
        methodSteps
        sampling
      }
      events(
        key: $key
        limit: $limit
        offset: $offset
        eventID: $eventID
        optParentEventID: $optParentEventID
      ) {
        endOfRecords
        results {
          eventId
          firstOccurrence {
            volatile {
              globe(sphere: false, land: false, graticule: false) {
                svg
                lat
                lon
              }
            }
            countryCode
            eventDate
            key
            datasetKey
            decimalLatitude
            decimalLongitude
            parentEventID
            eventID
            samplingProtocol
          }
        }
      }
    }
  }
`;
