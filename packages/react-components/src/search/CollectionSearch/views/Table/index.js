import React, { useContext } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import RouteContext from '../../../../dataManagement/RouteContext';
import { ResourceLink } from '../../../../components';
import { InlineFilterChip, LinkOption } from '../../../../widgets/Filter/utils/FilterChip';
import queryString from 'query-string';
import env from '../../../../../.env.json';

const QUERY = `
query list($preservationType: [PreservationType], $contentType: [CollectionContentType], $identifier: String, $alternativeCode: String, $personalCollection: Boolean, $occurrenceCount: String, $institution: [GUID], $code: String, $q: String, $offset: Int, $limit: Int, $country: [Country], $fuzzyName: String, $city: String, $name: String, $active: Boolean, $numberSpecimens: String, $displayOnNHCPortal: Boolean, $institutionKey: [GUID]){
  collectionSearch(institutionKey: $institutionKey, preservationType: $preservationType, contentType: $contentType, identifier: $identifier, alternativeCode: $alternativeCode, sortBy: NUMBER_SPECIMENS, sortOrder: DESC,  personalCollection: $personalCollection, occurrenceCount: $occurrenceCount, institution: $institution, code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active, numberSpecimens: $numberSpecimens, displayOnNHCPortal: $displayOnNHCPortal) {
    count
    offset
    limit
    results {
      key
      name
      code
      active
      numberSpecimens
      occurrenceCount
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
          <div>
            <ResourceLink type='collectionKey' id={item.key} data-loader style={{marginRight: 4}}>{value}</ResourceLink>
            {!item.active && <span style={{padding: '0 3px', background: 'tomato', color: 'white', borderRadius: 2}}>Inactive</span>}
          </div>
          <div style={{ color: '#aaa' }}>
            {item.institution && <LinkOption discreet type='institutionKey' id={item.institution.key} >
              <InlineFilterChip filterName="institution" values={[item.institution.key]}>
                <span data-loader>{item.institution.name}</span>
              </InlineFilterChip>
            </LinkOption>
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
      filterKey: 'countryGrSciColl',
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
    //     formatter: (value, item) => {
    //       return <InlineFilterChip filterName="active" values={[value.toString()]}>
    //         <FormattedMessage
    //           id={`enums.yesNo.${value.toString()}`}
    //         /></InlineFilterChip>
    //     },
    //   },
    //   filterKey: 'active'
    // }
  ]
};

function Table() {
  // const history = useHistory();
  const routeContext = useContext(RouteContext);

  return <StandardSearchTable 
    graphQuery={QUERY} 
    resultKey='collectionSearch' 
    defaultTableConfig={defaultTableConfig} 
    exportTemplate={({filter}) => `${env.API_V1}/grscicoll/collection/export?format=TSV&${filter ? queryString.stringify(filter) : ''}`}
    />
}

export default Table;