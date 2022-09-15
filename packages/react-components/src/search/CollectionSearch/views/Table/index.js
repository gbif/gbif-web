import React, { useContext } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import RouteContext from '../../../../dataManagement/RouteContext';
import { ResourceLink } from '../../../../components';
import { InlineFilterChip, InlineFilter } from '../../../../widgets/Filter/utils/FilterChip';
import { AiOutlinePlusCircle as AddIcon } from 'react-icons/ai';

const QUERY = `
query list($institution: [GUID], $code: String, $q: String, $offset: Int, $limit: Int, $country: Country, $fuzzyName: String, $city: String, $name: String, $active: Boolean, $numberSpecimens: String){
  collectionSearch(institution: $institution, code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active, numberSpecimens: $numberSpecimens) {
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
      institution {
        key
        name
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
        formatter: (value, item) => <div>
          <ResourceLink type='collectionKey' id={item.key} data-loader>{value}</ResourceLink>
          <div style={{ color: '#aaa' }}>
            {item.institution && <InlineFilterChip filterName="institution" values={[item.institution.key]}>
              <span data-loader>{item.institution.name}</span>
            </InlineFilterChip>
            }
            {!item.institution && <span style={{ fontStyle: 'italic' }} data-loader>
              <FormattedMessage id="collection.institutionUnknown" />
            </span>}
          </div>
        </div>,
      },
      width: 'wide'
    },
    {
      trKey: 'filters.code.name',
      value: {
        key: 'code',
        hideFalsy: true
      },
      filterKey: 'code',
      cellFilter: true,
    },
    {
      trKey: 'filters.country.name',
      value: {
        filterKey: 'country',
        key: 'key',
        formatter: (value, item) => {
          const countryCode = item.address?.country || item.mailingAddress?.country;
          return countryCode ? <InlineFilterChip filterName="country" values={[countryCode]}>
            <FormattedMessage
              id={`enums.countryCode.${countryCode}`}
            /></InlineFilterChip> : null;
        },
        hideFalsy: true
      },
      filterKey: 'country',
    },
    {
      trKey: 'filters.city.name',
      value: {
        filterKey: 'city',
        key: 'key',
        formatter: (value, item) => {
          const city = item.address?.city || item.mailingAddress?.city;
          return city ? <InlineFilterChip filterName="city" values={[city]}>{city}</InlineFilterChip> : null;
        },
        hideFalsy: true
      },
      filterKey: 'city',
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
    // {
    //   trKey: 'tableHeaders.gbifNumberSpecimens',
    //   value: {
    //     key: 'occurrenceCount',
    //     formatter: (value, item) => <FormattedNumber value={value} />,
    //     hideFalsy: true,
    //     rightAlign: true
    //   }
    // },
    {
      trKey: 'tableHeaders.active',
      value: {
        key: 'active',
        formatter: (value, item) => {
          return <InlineFilterChip filterName="active" values={[value.toString()]}>
            <FormattedMessage
              id={`enums.yesNo.${value.toString()}`}
            /></InlineFilterChip>
        },
      },
      filterKey: 'active'
    }
  ]
};

function Table() {
  // const history = useHistory();
  const routeContext = useContext(RouteContext);

  return <StandardSearchTable graphQuery={QUERY} resultKey='collectionSearch' defaultTableConfig={defaultTableConfig} />
}

export default Table;