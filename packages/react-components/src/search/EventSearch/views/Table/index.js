import React, { useContext, useEffect, useState } from "react";
import PredicateDataFetcher from '../../../PredicateDataFetcher';
import { EventsTable } from './EventsTable';
import { FormattedNumber } from 'react-intl';
import { ResourceLink } from '../../../../components';

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
        eventId
        samplingProtocol
        eventType {
          concept
        }
        parentEventId
        year
        datasetTitle
        datasetKey
        formattedCoordinates
        stateProvince
        countryCode
        measurementOrFactTypes
        measurementOrFactCount
        occurrenceCount
      }
    }
  }
}
`;

const defaultColumns = ['eventId', 'eventType', 'parentEventId', 'dataset', 'year', 'samplingProtcol', 'coordinates', 'stateProvince', 'countryCode', 'measurementTypes', 'measurements', 'OccurrenceCount']
const defaultTableConfig = {
  columns: [
    {
      trKey: 'filters.eventId.name',
      value: {
        key: 'eventId',
        formatter: (value, item) => <div>
          <ResourceLink type='eventKey' discreet id={item.eventId} otherIds={{datasetKey: item.datasetKey}}>{item.eventId}</ResourceLink>
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
      trKey: 'filters.parentEventId.name',
      filterKey: 'parentEventId',
      value: {
        key: 'parentEventId',
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
        formatter: (value, item) => <>{value.join(', ')}</>
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
    graphQuery={QUERY}
    graph='EVENT'
    limit={50}
    componentProps={{
      defaultTableConfig
    }}
    presentation={EventsTable}
  />
}

export default Table;