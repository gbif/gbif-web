import React, { useContext, useEffect, useState } from "react";
import PredicateDataFetcher from '../../../PredicateDataFetcher';
import { List } from './List';
import { FormattedNumber } from 'react-intl';
import { ErrorBoundary, ResourceLink } from '../../../../components';

const QUERY = `
query list($predicate: Predicate, $limit: Int){
  eventSearch(
    predicate:$predicate,
    ) {
    facet {
      datasetKey(size: $limit) {
        datasetTitle
        count
        key
        occurrenceCount        
        events {
          documents(size: 3) {
            total
            results {
              eventID
              samplingProtocol
              eventType {
                concept
              }
              parentEventID
              year
              datasetTitle
              datasetKey
              formattedCoordinates
              stateProvince
              countryCode
              measurementOrFactTypes
              measurementOrFactCount
            }
          }
        }
      }
    }
  }
}
`;

const defaultTableConfig = {
  columns: [
    {
      trKey: 'filters.eventID.name',
      value: {
        key: 'eventID',
        formatter: (value, item) => <div>
          <ResourceLink type='eventKey' discreet id={item.eventID} otherIds={{ datasetKey: item.datasetKey }}>{item.eventID}</ResourceLink>
        </div>
      },
    },
    {
      trKey: 'filters.eventType.name',
      value: {
        key: 'eventType.concept',
        labelHandle: 'eventTypeVocabulary',
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.parentEventID.name',
      filterKey: 'parentEventID',
      value: {
        key: 'parentEventID',
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.datasetKey.name',
      filterKey: 'datasetKey',
      value: {
        key: 'datasetKey',
        formatter: (value, item) => item?.datasetTitle,
        hideFalsy: true
      },
      width: 'wide'
    },
    {
      trKey: 'filters.year.name',
      filterKey: 'year',
      value: {
        key: 'year',
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.samplingProtocol.name',
      filterKey: 'eventSamplingProtocol',
      value: {
        key: 'samplingProtocol',
        formatter: (value, item) => item?.samplingProtocol[0],
        hideFalsy: true
      }
    },
    {
      name: 'coordinates',
      trKey: 'filters.coordinates.name',
      value: {
        key: 'formattedCoordinates',
      },
      noWrap: true
    },
    {
      name: 'stateProvince',
      trKey: 'filters.stateProvince.name',
      value: {
        key: 'stateProvince',
      }
    },
    {
      name: 'countryCode',
      trKey: 'filters.country.name',
      value: {
        key: 'countryCode',
        labelHandle: 'countryCode'
      }
    },
    {
      name: 'measurementOrFactTypes',
      trKey: 'filters.measurementOrFactTypes.name',
      value: {
        key: 'measurementOrFactTypes',
        formatter: (value, item) => <>{value.join(',')}</>
      }
    },
    {
      name: 'measurementOrFactCount',
      trKey: 'filters.measurementOrFactCount.name',
      value: {
        key: 'measurementOrFactCount',
        hideFalsy: true
      },
      noWrap: true,
    },
    {
      name: 'occurrenceCount',
      trKey: 'tableHeaders.occurrences',
      value: {
        key: 'occurrenceCount',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      },
      noWrap: true
    },
  ]
};

function Table() {
  return <PredicateDataFetcher
    queryProps={{throwAllErrors: true}}
    graphQuery={QUERY}
    graph='EVENT'
    queryTag='datasets'
    limit={50}
    componentProps={{
      defaultTableConfig
    }}
    presentation={List}
  />
}

export default props => <ErrorBoundary><Table {...props} /></ErrorBoundary>;