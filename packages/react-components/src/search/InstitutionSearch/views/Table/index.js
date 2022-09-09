import React from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { ResourceLink } from '../../../../components';
import { InlineFilterChip, InlineFilter } from '../../../../widgets/Filter/utils/FilterChip';

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
      trKey: 'tableHeaders.title',
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
      },
      filterKey: 'code'
    },
    {
      trKey: 'filters.country.name',
      filterKey: 'country',
      value: {
        key: 'key',
        formatter: (value, item) => {
          const countryCode = item.address?.country || item.mailingAddress?.country;
          return countryCode ? <InlineFilterChip filterName="country" values={[countryCode]}>
            <FormattedMessage
              id={`enums.countryCode.${countryCode}`}
            /></InlineFilterChip> : null;
        },
        hideFalsy: true,
      }
    },
    {
      trKey: 'filters.city.name',
      value: {
        key: 'key',
        formatter: (value, item) => {
          const city = item.address?.city || item.mailingAddress?.city;
          return city ? <InlineFilterChip filterName="city" values={[city]}>{city}</InlineFilterChip> : null;
        },
        hideFalsy: true
      },
      filterKey: 'city'
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
      trKey: 'tableHeaders.active',
      value: {
        key: 'active',
        labelHandle: 'yesNo'
      },
      filterKey: 'active'
    }
  ]
};

function Table() {
  return <StandardSearchTable graphQuery={QUERY} resultKey='institutionSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;