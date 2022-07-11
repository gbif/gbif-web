import React, { useContext, useEffect, useState } from "react";
import PredicateDataFetcher from '../../../PredicateDataFetcher';
import { EventsTable } from './EventsTable';
import { FormattedNumber } from 'react-intl';

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
        hideFalsy: true
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
      trKey: 'filters.locationID.name',
      filterKey: 'locationID',
      value: {
        key: 'locationID',
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
      trKey: 'filters.month.name',
      filterKey: 'month',
      value: {
        key: 'month',
        hideFalsy: true
      }
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
      name: 'occurrenceCount',
      trKey: 'tableHeaders.occurrences',
      value: {
        key: 'occurrenceCount',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      },
      noWrap: true
    }
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