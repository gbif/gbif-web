import React, { useContext } from "react";
import RouteContext from '../../../../dataManagement/RouteContext';
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedNumber } from 'react-intl';
import { DatasetKeyLink, Skeleton } from '../../../../components';
import queryString from 'query-string';
import env from '../../../../../.env.json';
import { InlineFilterChip } from "../../../../widgets/Filter/utils/FilterChip";

const DATASET_LIST = `
query list($license: [License], $endorsingNodeKey: [ID], $networkKey: [ID], $publishingOrg: [ID], $hostingOrg: [ID], $publishingCountry: [Country], $q: String, $offset: Int, $limit: Int, $type: [DatasetType], $subtype: [DatasetSubtype]){
  datasetSearch(license: $license, endorsingNodeKey:$endorsingNodeKey, networkKey:$networkKey, publishingOrg:$publishingOrg, hostingOrg: $hostingOrg, publishingCountry: $publishingCountry, q: $q, limit: $limit, offset: $offset, type: $type, subtype: $subtype) {
    count
    offset
    limit
    results {
      key
      title
      publishingOrganizationTitle
      publishingOrganizationKey
      type
      subtype
      recordCount
    }
  }
}
`;

const SLOW_QUERY = `
query list($license: [License], $endorsingNodeKey: [ID], $networkKey: [ID], $publishingOrg: [ID], $hostingOrg: [ID], $publishingCountry: [Country], $q: String, $offset: Int, $limit: Int, $type: [DatasetType], $subtype: [DatasetSubtype]){
  datasetSearch(license: $license, endorsingNodeKey:$endorsingNodeKey, networkKey:$networkKey, publishingOrg:$publishingOrg, hostingOrg: $hostingOrg, publishingCountry: $publishingCountry, q: $q, limit: $limit, offset: $offset, type: $type, subtype: $subtype) {
    results {
      key
      occurrenceCount
      literatureCount
    }
  }
}
`;

const defaultTableConfig = {
  columns: [
    {
      trKey: 'tableHeaders.title',
      value: {
        key: 'title',
        formatter: (value, item) => <DatasetKeyLink discreet id={item.key}>{value}</DatasetKeyLink>,
      },
      width: 'wide'
    },
    {
      trKey: 'filters.publisherKey.name',
      filterKey: 'anyPublisherKey', // optional
      value: {
        key: 'publishingOrganizationKey',
        // formatter: (value, item) => item.publishingOrganizationTitle
        formatter: (value, item) => <InlineFilterChip filterName="publishingOrg" values={[item.publishingOrganizationKey]}>
        <span data-loader>{item.publishingOrganizationTitle}</span>
      </InlineFilterChip>
      },
      width: 'wide',
    },
    {
      trKey: 'filters.datasetType.name',
      filterKey: 'datasetType',
      value: {
        key: 'type',
        labelHandle: 'datasetType'
      },
      cellFilter: true,
    },
    // {
    //   trKey: 'filters.datasetSubtype.name',
    //   filterKey: 'datasetSubtype',
    //   value: {
    //     key: 'subtype',
    //     labelHandle: 'datasetSubtype',
    //     hideFalsy: true
    //   }
    // },
    {
      trKey: 'tableHeaders.citations',
      value: {
        key: 'literatureCount',
        formatter: (value, item) => {
          if (typeof value === 'undefined') return <Skeleton />;
          return <FormattedNumber value={value} />
        },
        hideFalsy: false,
        rightAlign: true
      }
    },
    {
      trKey: 'tableHeaders.occurrences',
      value: {
        key: 'occurrenceCount',
        formatter: (value, item) => {
          if (typeof value === 'undefined') return <Skeleton />;
          return <FormattedNumber value={value} />
        },
        hideFalsy: false,
        rightAlign: true
      }
    }
  ]
};

function Table() {
  const routeContext = useContext(RouteContext);
  return <StandardSearchTable 
    graphQuery={DATASET_LIST} 
    slowQuery={SLOW_QUERY} 
    resultKey='datasetSearch' 
    defaultTableConfig={defaultTableConfig}
    exportTemplate={({filter}) => `${env.API_V1}/dataset/search/export?format=TSV&${filter ? queryString.stringify(filter) : ''}`}
    />
}

export default Table;