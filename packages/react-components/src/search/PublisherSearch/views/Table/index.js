import React from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedNumber } from 'react-intl';

const QUERY = `
query list($country: Country, $q: String, $offset: Int, $limit: Int){
  organizationSearch(isEndorsed: true, q: $q, limit: $limit, offset: $offset, country: $country) {
    count
    offset
    limit
    results {
      key
      title
      country
    }
  }
}
`;

const defaultTableConfig = {
  columns: [
    {
      trKey: 'title',
      value: {
        key: 'title',
      },
      width: 'wide'
    },
    {
      trKey: 'filter.countryCode.name',
      value: {
        key: 'country',
        labelHandle: 'countryCode',
        hideFalsy: true
      }
    }
  ]
};

function Table() {
  return <StandardSearchTable graphQuery={QUERY} resultKey='organizationSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;