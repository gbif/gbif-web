import React, { useContext } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
// import { useHistory } from "react-router-dom";
import RouteContext from '../../../../dataManagement/RouteContext';
import { ResourceLink } from '../../../../components';

const QUERY = `
query list($institution: [GUID], $code: String, $q: String, $offset: Int, $limit: Int, $country: Country, $fuzzyName: String, $city: String, $name: String, $active: Boolean){
  collectionSearch(institution: $institution, code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active) {
    count
    offset
    limit
    results {
      key
      name
      code
      active
      occurrenceCount
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
        formatter: (value, item) => <ResourceLink type='collectionKey' discreet id={item.key}>{value}</ResourceLink>,
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
      trKey: 'tableHeaders.occurrences',
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
  // const history = useHistory();
  const routeContext = useContext(RouteContext);

  return <StandardSearchTable graphQuery={QUERY} resultKey='collectionSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;