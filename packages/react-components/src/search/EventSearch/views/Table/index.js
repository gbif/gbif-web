import React, { useContext } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';
// import { useHistory } from "react-router-dom";
import RouteContext from '../../../../dataManagement/RouteContext';
import { ResourceLink } from '../../../../components';

const QUERY = `
query list($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  eventSearch(predicate: $predicate, size: $size, from: $from) {
    documents(size: $size, from: $from) {
      total 
      results {
        key
        datasetKey
        datasetTitle
        sampleSizeUnit
        sampleSizeValue
        samplingProtocol
        samplingEffort
        eventID
        countryCode
        parentEventID
        eventDate
        decimalLatitude
        decimalLongitude
        occurrenceCount
      }
    }
  }
}
`;

const defaultTableConfig = {
  columns: [
    {
      trKey: 'filters.eventId.name',
      filterKey: 'eventId',
      value: {
        key: 'eventID',
        formatter: (value, item) => <div>
          <ResourceLink type='eventKey' discreet id={item.eventID} otherIds={{datasetKey: item.datasetKey}}>{item.eventID}</ResourceLink>
        </div>
      },
      width: 'wide'
    },
    {
      trKey: 'filters.parentEventId.name',
      filterKey: 'parentEventId',
      value: {
        key: 'parentEventID'
      }
    },
    {
      trKey: 'filters.datasetKey.name',
      filterKey: 'datasetKey',
      value: {
        key: 'datasetKey',
        formatter: (value, item) => <ResourceLink type='datasetKey' discreet id={item.datasetKey}>{item.datasetTitle}</ResourceLink>,
        hideFalsy: true
      },
      width: 'wide'
    },
    {
      trKey: 'Event date',
      value: {
        key: 'eventDate',
        formatter: (value, item) => <FormattedDate value={item.eventDate}
        year="numeric"
        month="long"
        day="2-digit" />,
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.country.name',
      filterKey: 'country',
      value: {
        key: 'countryCode',
        labelHandle: 'countryCode',
        hideFalsy: true
      }
    },
    {
      trKey: 'Coordinates',
      value: {
        key: 'decimalLatitude',
        formatter: (value, item) => <img width={160} src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+555555(${item.decimalLongitude},${item.decimalLatitude})/${item.decimalLongitude},${item.decimalLatitude},4,0/320x160@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />,
        hideFalsy: true
      }
    },
    {
      trKey: 'tableHeaders.occurrences',
      value: {
        key: 'occurrenceCount',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      }
    },
    {
      trKey: 'filters.samplingProtocol.name',
      filterKey: 'eventSamplingProtocol',
      value: {
        key: 'samplingProtocol',
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.sampleSizeUnit.name',
      filterKey: 'sampleSizeUnit',
      value: {
        key: 'sampleSizeUnit',
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.sampleSizeValue.name',
      filterKey: 'sampleSizeValue',
      value: {
        key: 'sampleSizeValue',
        hideFalsy: true
      }
    },
    {
      trKey: 'Sampling effort',
      value: {
        key: 'samplingEffort',
        hideFalsy: true
      }
    }
  ]
};

function Table() {
  // const history = useHistory();
  const routeContext = useContext(RouteContext);

  return <StandardSearchTable usePredicate graphQuery={QUERY} resultKey='eventSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;