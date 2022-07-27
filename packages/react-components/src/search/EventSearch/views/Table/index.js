import React, { useContext, useEffect, useState } from "react";
import PredicateDataFetcher from '../../../PredicateDataFetcher';
import { EventsTable } from './EventsTable';
import {FormattedMessage, FormattedNumber} from 'react-intl';

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
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.dataStructure.name',
      value: {
        key: 'eventTypeHierarchyJoined',
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
        formatter: (value, item) => <FormattedMessage id={`enums.month.${value}`} /> ,
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
    // {
    //   trKey: 'filters.samplingProtocol.name',
    //   filterKey: 'eventSamplingProtocol',
    //   value: {
    //     key: 'samplingProtocol',
    //     formatter: (value, item) => item?.samplingProtocol[0],
    //     hideFalsy: true
    //   }
    // },
    {
      trKey: 'filters.locationID.name',
      filterKey: 'locationID',
      value: {
        key: 'locationID',
        // tricky how to do an untuitive not cluttered UI for this.
        formatter: (value, item, {filterContext}) => <span 
          // style={{padding: '0 3px', whiteSpace: 'nowrap', border: '1px solid #aaa', borderRadius: 3}} 
          onClick={(e) => {
          filterContext.setField('locationId', [value], true);
          e.preventDefault();
          e.stopPropagation();
        }}>{value}</span>,
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
    },
    {
      name: 'speciesCount',
      trKey: 'tableHeaders.species',
      value: {
        key: 'speciesCount',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      },
      noWrap: true
    },
  ]
};

function predicateMeddler(currentPredicate){
  // // change predicate
  // if (currentPredicate.predicates[0].predicates && Array.isArray(currentPredicate.predicates[0].predicates)){
  //   currentPredicate.predicates[0].predicates.forEach((predicate, idx) => {
  //     if (predicate.key == "eventTypeHierarchy") {
  //       predicate.key = "eventType"
  //     }
  //     if (predicate.key == "eventHierarchy") {
  //       predicate.key = "eventID"
  //     }
  //   });
  // } else {
  //   if (currentPredicate.predicates[0].key == "eventTypeHierarchy") {
  //     currentPredicate.predicates[0].key = "eventType"
  //   }
  //   if (currentPredicate.predicates[0].key == "eventHierarchy") {
  //     currentPredicate.predicates[0].key = "eventID"
  //   }
  // }
}

function Table() {
  return <PredicateDataFetcher
    graphQuery={QUERY}
    graph='EVENT'
    limit={50}
    componentProps={{
      defaultTableConfig
    }}
    predicateMeddler={predicateMeddler}
    presentation={EventsTable}
  />
}

export default Table;