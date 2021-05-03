import React, { useContext } from "react";
import RouteContext from '../../../../dataManagement/RouteContext';
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedNumber } from 'react-intl';

const DATASET_LIST = `
query list($publishingOrg: [ID], $hostingOrg: [ID], $publishingCountry: [Country], $q: String, $offset: Int, $limit: Int, $type: [DatasetType], $subtype: [DatasetSubtype]){
  datasetSearch(publishingOrg:$publishingOrg, hostingOrg: $hostingOrg, publishingCountry: $publishingCountry, q: $q, limit: $limit, offset: $offset, type: $type, subtype: $subtype) {
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
      trKey: 'title',
      value: {
        key: 'title',
      },
      width: 'wide'
    },
    {
      trKey: 'filter.publisherKey.name',
      filterKey: 'publisherKey', // optional
      value: {
        key: 'publishingOrganizationKey',
        formatter: (value, item) => item.publishingOrganizationTitle
      },
      width: 'wide'
    },
    {
      trKey: 'filter.datasetType.name',
      filterKey: 'datasetType',
      value: {
        key: 'type',
        labelHandle: 'datasetType'
      }
    },
    {
      trKey: 'filter.datasetSubtype.name',
      filterKey: 'datasetSubtype',
      value: {
        key: 'subtype',
        labelHandle: 'datasetSubtype',
        hideFalsy: true
      }
    },
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

  function onSelect({key}) {
    const path = routeContext.datasetKey.url({key});
    window.location = path;
  }

  return <StandardSearchTable onSelect={onSelect} graphQuery={DATASET_LIST} resultKey='datasetSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;