import React from 'react';
import PredicateDataFetcher from '../../../search/PredicateDataFetcher';
import { SpecimensTable } from './SpecimensTable';
import { ErrorBoundary } from '../../../components';
import StandaloneSearch from '../../../search/Search';

// Config
import defaultFilterConfig from './config/filterConf';
import predicateConfig from './config/predicateConfig';
import defaultTableConfig from './config/defaultTableConfig';
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
        distinctTaxa {
          scientificName
          rank
        }
      }
    }
  }
}
`;

function Table() {
  const intl = useIntl();
  return (
    <PredicateDataFetcher
      queryProps={{ throwAllErrors: true }}
      graphQuery={QUERY}
      graph='EVENT'
      queryTag='table'
      limit={50}
      componentProps={{
        defaultTableConfig: defaultTableConfig(intl),
      }}
      presentation={SpecimensTable}
    />
  );
}

export default ({ id, config }) => {
  const specimenConfig = config || {};

  // Only show accession events related to the current taxa on the taxon page
  if (!specimenConfig.rootFilter || specimenConfig.rootFilter.type !== 'and') {
    specimenConfig.rootFilter = {
      type: 'and',
      predicates: [
        ...(specimenConfig.rootFilter ? [specimenConfig.rootFilter] : []),
        ...(id
          ? [
              {
                key: 'catalogNumber',
                type: 'equals',
                value: id,
              },
            ]
          : []),
        {
          key: 'eventType',
          type: 'equals',
          value: 'Trial',
        },
      ],
    };
  }

  return (
    <ErrorBoundary>
      <StandaloneSearch
        {...{
          config: specimenConfig,
          defaultFilterConfig,
          predicateConfig,
          Table,
        }}
        suggestRootFilter
      />
    </ErrorBoundary>
  );
};
