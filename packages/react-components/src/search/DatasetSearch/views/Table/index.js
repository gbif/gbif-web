import React, { useContext } from "react";
import RouteContext from '../../../../dataManagement/RouteContext';
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedNumber } from 'react-intl';
import { DatasetKeyLink } from '../../../../components';

const DATASET_LIST = `
query list($endorsingNodeKey: [ID], $networkKey: [ID], $publishingOrg: [ID], $hostingOrg: [ID], $publishingCountry: [Country], $q: String, $offset: Int, $limit: Int, $type: [DatasetType], $subtype: [DatasetSubtype]){
  datasetSearch(endorsingNodeKey:$endorsingNodeKey, networkKey:$networkKey, publishingOrg:$publishingOrg, hostingOrg: $hostingOrg, publishingCountry: $publishingCountry, q: $q, limit: $limit, offset: $offset, type: $type, subtype: $subtype) {
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
      filterKey: 'publisherKey', // optional
      value: {
        key: 'publishingOrganizationKey',
        formatter: (value, item) => item.publishingOrganizationTitle
      },
      width: 'wide'
    },
    {
      trKey: 'filters.datasetType.name',
      filterKey: 'datasetType',
      value: {
        key: 'type',
        labelHandle: 'datasetType'
      }
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
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true
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
    }
  ]
};

function Table() {
  const routeContext = useContext(RouteContext);
  return <StandardSearchTable graphQuery={DATASET_LIST} resultKey='datasetSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;