import { jsx, css } from '@emotion/react';
import React, { useContext } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { ResourceLink, Button } from '../../../../components';
import { InlineFilterChip } from '../../../../widgets/Filter/utils/FilterChip';
import Map from '../Map/Map';
import { MdMap } from 'react-icons/md';
import useBelow from '../../../../utils/useBelow';
import SiteContext from '../../../../dataManagement/SiteContext';
import queryString from 'query-string';
import env from '../../../../../.env.json';

// NB it is essential that the fast and slow query returns the same results in the same order. Else we cannot merge them.
const QUERY = `
query list($institutionKey: [GUID!], $discipline: [String!], $type: [String!], $identifier: String, $alternativeCode: [String!], $occurrenceCount: [String!], $code: [String!], $q: String, $offset: Int, $limit: Int, $country: [Country!], $fuzzyName: [String!], $city: [String!], $name: [String!], $active: [Boolean!], $numberSpecimens: [String!], $displayOnNHCPortal: [Boolean!]){
  institutionSearch(sortBy: NUMBER_SPECIMENS, sortOrder: DESC, discipline: $discipline, type: $type, identifier: $identifier, alternativeCode: $alternativeCode, occurrenceCount: $occurrenceCount, code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active, numberSpecimens: $numberSpecimens, displayOnNHCPortal: $displayOnNHCPortal, institutionKey: $institutionKey) {
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
      country
      mailingCountry
      city
      mailingCity
    }
  }
}
`;

const SLOW_QUERY = `
query list($institutionKey: [GUID!], $discipline: [String!], $type: [String!], $identifier: String, $alternativeCode: [String!], $occurrenceCount: [String!], $code: [String!], $q: String, $offset: Int, $limit: Int, $country: [Country!], $fuzzyName: [String!], $city: [String!], $name: [String!], $active: [Boolean!], $numberSpecimens: [String!], $displayOnNHCPortal: [Boolean!]){
  institutionSearch(sortBy: NUMBER_SPECIMENS, sortOrder: DESC, discipline: $discipline, type: $type, identifier: $identifier, alternativeCode: $alternativeCode, occurrenceCount: $occurrenceCount, code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active, numberSpecimens: $numberSpecimens, displayOnNHCPortal: $displayOnNHCPortal, institutionKey: $institutionKey) {
    results {
      key
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
          <ResourceLink data-loader type='institutionKey' id={item.key} style={{ marginRight: 4 }}>{value}</ResourceLink>
          {!item.active && <span style={{ padding: '0 3px', background: 'tomato', color: 'white', borderRadius: 2 }}>Inactive</span>}
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
      filterKey: 'countryGrSciColl',
      value: {
        key: 'key',
        formatter: (value, item) => {
          const countryCode = item.country || item.mailingCountry;
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
          const city = item.city || item.mailingCity;
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
  const siteContext = useContext(SiteContext);
  const mapSettings = siteContext?.institution?.mapSettings;
  const [showMap, setShowMap] = React.useState(mapSettings?.enabled);
  const [showTable, setShowTable] = React.useState(true);
  const noSplitPane = useBelow(800);

  // if with below 800px, then the Button should toggle between map and table. If above 800px then the button should toggle the map view, but keep the table in view.
  const tableView = showTable || !noSplitPane || !mapSettings?.enabled;
  const mapVisible = mapSettings?.enabled && ((showMap && !noSplitPane) || (!tableView && noSplitPane));

  return <div
    css={css`
      flex: 1 1 100%;
      display: flex;
      height: 100%;
      max-height: 100vh;
      flex-direction: row;
      position: relative;
    `}>
    {mapSettings?.enabled && <div css={css`
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1000;
      font-size: 18px;
      color: var(--color500);
    `}>
      <Button look="text" onClick={() => {
        setShowMap(!showMap);
        setShowTable(!showTable);
      }}>
        <MdMap />
      </Button>
    </div>}
    {tableView && <StandardSearchTable showEmptyTable
      style={{ width: '50%', flex: '1 0 50%', marginRight: showMap && !noSplitPane ? 12 : 0 }} 
      graphQuery={QUERY} 
      slowQuery={SLOW_QUERY} 
      resultKey='institutionSearch' 
      defaultTableConfig={defaultTableConfig} 
      exportTemplate={({filter}) => `${env.API_V1}/grscicoll/institution/export?format=TSV&${filter ? queryString.stringify(filter) : ''}`}
      />}
    {mapVisible && <Map style={{ width: '50%', flex: '1 0 50%' }} />}
  </div>
}

export default Table;