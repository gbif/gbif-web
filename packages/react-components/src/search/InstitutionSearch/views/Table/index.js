import React from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { ResourceLink } from '../../../../components';
import { InlineFilterChip } from '../../../../widgets/Filter/utils/FilterChip';

const QUERY = `
query list($code: String, $q: String, $offset: Int, $limit: Int, $country: Country, $fuzzyName: String, $city: String, $name: String, $active: Boolean, $numberSpecimens: String, , $displayOnNHCPortal: Boolean){
  institutionSearch(code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active, numberSpecimens: $numberSpecimens, displayOnNHCPortal: $displayOnNHCPortal) {
    count
    offset
    limit
    results {
      key
      name
      code
      active
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

const SLOW_QUERY = `
query list($code: String, $q: String, $offset: Int, $limit: Int, $country: Country, $fuzzyName: String, $city: String, $name: String, $active: Boolean, $numberSpecimens: String, , $displayOnNHCPortal: Boolean){
  institutionSearch(code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active, numberSpecimens: $numberSpecimens, displayOnNHCPortal: $displayOnNHCPortal) {
    results {
      key
      occurrenceCount
      collectionCount
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
        formatter: (value, item) => <div>
          <ResourceLink data-loader type='institutionKey' id={item.key} style={{marginRight: 4}}>{value}</ResourceLink>
          {!item.active && <span style={{padding: '0 3px', background: 'tomato', color: 'white', borderRadius: 2}}>Inactive</span>}
        </div>,
      },
      width: 'wide'
    },
    {
      trKey: 'filters.code.name',
      value: {
        key: 'code',
        hideFalsy: true,
      },
      filterKey: 'code',
      cellFilter: true,
    },
    {
      trKey: 'filters.country.name',
      filterKey: 'countrySingleGrSciColl',
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
      trKey: 'tableHeaders.collectionCount',
      value: {
        key: 'collectionCount',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
      }
    },
    {
      trKey: 'tableHeaders.numberSpecimens',
      filterKey: 'numberSpecimens',
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
    // {
    //   trKey: 'tableHeaders.active',
    //   value: {
    //     key: 'active',
    //     // labelHandle: 'yesNo',
    //     formatter: (value, item) => {
    //       return <InlineFilterChip filterName="active" values={[value.toString()]}>
    //         <FormattedMessage
    //           id={`enums.yesNo.${value.toString()}`}
    //         /></InlineFilterChip>
    //     },
    //   },
    //   filterKey: 'active',
    // }
  ]
};

function Table() {
  return <StandardSearchTable graphQuery={QUERY} slowQuery={SLOW_QUERY} resultKey='institutionSearch' defaultTableConfig={defaultTableConfig} />
}

export default Table;