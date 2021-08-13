import React, { useContext } from "react";
import RouteContext from '../../../../dataManagement/RouteContext';
import StandardSearch from '../../../StandardSearch';
import { ResultsTable } from '../../../ResultsTable';
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';

const QUERY = `
query list($networkKey: ID, $country: Country, $q: String, $offset: Int, $limit: Int){
  organizationSearch(networkKey: $networkKey, isEndorsed: true, q: $q, limit: $limit, offset: $offset, country: $country) {
    count
    offset
    limit
    results {
      key
      title
      country
      numPublishedDatasets
      hostedDataset {
        count
      }
      created
    }
  }
}
`;

const defaultTableConfig = {
  columns: [
    {
      trKey: 'filter.publisherKey.name',
      value: {
        key: 'title',
      },
      width: 'wide',
      filterKey: 'q'
    },
    {
      trKey: 'published datasets',
      value: {
        key: 'numPublishedDatasets',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      }
    },
    {
      trKey: 'hosted datasets',
      value: {
        key: 'hostedDataset.count',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      }
    },
    {
      trKey: 'filter.publishingCountryCode.name',
      value: {
        key: 'country',
        labelHandle: 'countryCode',
        hideFalsy: true
      },
      filterKey: 'country'
    },
    {
      trKey: 'joined',
      value: {
        key: 'created',
        formatter: (value, item) => <FormattedDate value={value}
          year="numeric"
          month="long"
          day="2-digit" />,
        hideFalsy: true
      },
      noWrap: true
    },
  ]
};

function Table() {
  const routeContext = useContext(RouteContext);

  function onSelect({key}) {
    const path = routeContext.publisherKey.url({key});
    window.location = path;
  }
  return <StandardSearch 
    presentationComponent={ResultsTable}
    onSelect={onSelect} 
    graphQuery={QUERY} 
    resultKey='organizationSearch' 
    defaultTableConfig={defaultTableConfig}
    hideLock={true}
    />
}

export default Table;