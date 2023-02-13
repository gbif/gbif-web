import React from 'react';
import PredicateDataFetcher from '../../../../../search/PredicateDataFetcher';
import { TrialsGrid } from './Grid';

// Config
import { useIntl } from 'react-intl';

const QUERY = `
query list($predicate: Predicate, $offset: Int, $limit: Int){
  results: eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $offset
    ) {
    documents {
      size
      from
      total
      results {
        eventID
        samplingProtocol
        eventType {
          concept
        }
        day
        month
        year
        parentEventID
        locationID
        month
        year
        datasetTitle
        datasetKey
        formattedCoordinates
        stateProvince
        countryCode
        measurementOrFactTypes
        occurrenceCount
        speciesCount
        eventTypeHierarchyJoined
        locality
        temporalCoverage {
          gte
          lte
        }
        measurementOrFacts {
          measurementID
          measurementType
          measurementUnit
          measurementValue
          measurementMethod
          measurementRemarks
          measurementAccuracy
          measurementDeterminedBy
          measurementDeterminedDate
        }
        occurrences(size: 1) {
          results {
            catalogNumber
          }
        }
      }
    }
  }
}
`;

export default function Table() {
  const intl = useIntl();
  return (
    <PredicateDataFetcher
      queryProps={{ throwAllErrors: true }}
      graphQuery={QUERY}
      graph='EVENT'
      queryTag='table'
      limit={50}
      presentation={TrialsGrid}
      predicates={[
        {
          key: 'eventType',
          type: 'equals',
          value: 'Trial',
        },
      ]}
    />
  );
}
