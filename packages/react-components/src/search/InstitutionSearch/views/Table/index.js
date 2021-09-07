import React, { useContext } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useHistory } from "react-router-dom";
import RouteContext from '../../../../dataManagement/RouteContext';
import { ResourceLink } from '../../../../components';

const QUERY = `
query list($code: String, $q: String, $offset: Int, $limit: Int, $country: Country, $fuzzyName: String, $city: String, $name: String, $active: Boolean){
  institutionSearch(code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active) {
    count
    offset
    limit
    results {
      key
      name
      code
      active
      occurrenceCount
      numberSpecimens
      address {
        city
        country
      }
      mailingAddress {
        city
        country
      }
    }
  }
}
`;

const defaultTableConfig = {
  columns: [
    {
      trKey: 'title',
      value: {
        key: 'name',
        formatter: (value, item) => <ResourceLink type='institutionKey' discreet id={item.key}>{value}</ResourceLink>,
      },
      width: 'wide'
    },
    {
      trKey: 'filters.code.name',
      value: {
        filterKey: 'code',
        key: 'code',
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.country.name',
      value: {
        filterKey: 'country',
        key: 'key',
        formatter: (value, item) => {
          const countryCode = item.address?.country || item.mailingAddress?.country;
          return countryCode ? <FormattedMessage id={`enums.countryCode.${countryCode}`} /> : null;
        },
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.city.name',
      value: {
        filterKey: 'city',
        key: 'key',
        formatter: (value, item) => item.address?.city || item.mailingAddress?.city,
        hideFalsy: true
      }
    },
    {
      trKey: 'tableHeaders.numberSpecimens',
      value: {
        key: 'numberSpecimens',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      }
    },
    {
      trKey: 'tableHeaders.gbifNumberSpecimens',
      value: {
        key: 'occurrenceCount',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      }
    },
    {
      trKey: 'active',
      value: {
        key: 'active',
        formatter: (value, item) => value ? 'yes' : 'no'
      }
    }
  ]
};

function Table() {
  return <StandardSearchTable graphQuery={QUERY} resultKey='institutionSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;