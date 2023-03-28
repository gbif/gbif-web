import React from 'react';
import PredicateDataFetcher from '../../../../../search/PredicateDataFetcher';
import { CollectionsTable } from './Table';

// Config
import { useIntl } from 'react-intl';
import tableConfig from './tableConfig';

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
        parentEventID
        locationID
        locality
        month
        year
        datasetTitle
        datasetKey
        formattedCoordinates
        stateProvince
        countryCode
        measurementOrFactTypes
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
      componentProps={{
        defaultTableConfig: tableConfig(intl),
      }}
      presentation={CollectionsTable}
      predicates={[
        {
          key: 'eventType',
          type: 'equals',
          value: 'Accession',
        },
      ]}
    />
  );
}
