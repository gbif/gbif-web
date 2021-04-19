import React, { useContext } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useHistory } from "react-router-dom";
import RouteContext from '../../../../dataManagement/routeContext';

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
  onSelect: ({key}) => {
    window.location = `/collection/${key}`
  },
  columns: [
    {
      trKey: 'title',
      value: {
        key: 'name',
      },
      width: 'wide'
    },
    {
      trKey: 'filter.code.name',
      value: {
        filterKey: 'code',
        key: 'code',
        hideFalsy: true
      }
    },
    {
      trKey: 'filter.countryCode.name',
      value: {
        filterKey: 'countryCode',
        key: 'key',
        formatter: (value, item) => {
          const countryCode = item.address?.country || item.mailingAddress?.country;
          return countryCode ? <FormattedMessage id={`enums.countryCode.${countryCode}`} /> : null;
        },
        hideFalsy: true
      }
    },
    {
      trKey: 'filter.city.name',
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
  const history = useHistory();
  const routeContext = useContext(RouteContext);

  function onSelect({key}) {
    const path = routeContext.collectionKey.url({key});
    window.location = path;
    // if (history && !useWindowLocation) {
    //   history.push(path);
    // } else {
    //   
    // }
  }

  return <StandardSearchTable onSelect={onSelect} graphQuery={QUERY} resultKey='collectionSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;