import React, { useContext } from "react";
import RouteContext from '../../../../dataManagement/RouteContext';
import StandardSearchTable from '../../../StandardSearchTable';
import { ResultsTable } from '../../../ResultsTable';
import { PublisherKeyLink } from '../../../../components';
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';
import { MdLink } from 'react-icons/md';
import { InlineFilterChip } from "../../../../widgets/Filter/utils/FilterChip";

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
      trKey: 'filters.publisherKey.name',
      value: {
        key: 'title',
        formatter: (value, item) => <PublisherKeyLink discreet id={item.key}>{value}</PublisherKeyLink>,
      },
      width: 'wide',
      filterKey: 'q'
    },
    {
      trKey: 'filters.publishingCountryCode.name',
      value: {
        key: 'country',
        // labelHandle: 'countryCode',
        hideFalsy: true,
        formatter: (countryCode, item) => {
          return countryCode ? <InlineFilterChip filterName="country" values={[countryCode]}>
            <FormattedMessage
              id={`enums.countryCode.${countryCode}`}
            /></InlineFilterChip> : null;
        },
      },
      filterKey: 'countrySingle'
    },
    {
      trKey: 'tableHeaders.pubDatasets',
      value: {
        key: 'numPublishedDatasets',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      }
    },
    {
      trKey: 'tableHeaders.hostedDatasets',
      value: {
        key: 'hostedDataset.count',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      }
    },
    {
      trKey: 'tableHeaders.registered',
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

  return <StandardSearchTable 
    queryProps={{throwAllErrors: true}}
    presentationComponent={ResultsTable}
    graphQuery={QUERY} 
    queryTag='table'
    resultKey='organizationSearch' 
    defaultTableConfig={defaultTableConfig}
    hideLock={true}
    />
}

export default Table;