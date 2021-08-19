import React, { useContext } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
// import { useHistory } from "react-router-dom";
import RouteContext from '../../../../dataManagement/RouteContext';

const QUERY = `

query list($publisher:[String], $source: [String], $doi: [String], $gbifDownloadKey: [ID], $openAccess: Boolean, $peerReview: Boolean, $publishingOrganizationKey: [ID], $topics: [String], $relevance: [String], $year: [String], $literatureType: [String], $countriesOfCoverage: [Country], $countriesOfResearcher: [Country], $gbifDatasetKey: [ID], $q: String, $offset: Int, $limit: Int, ){
  literatureSearch(gbifDatasetKey: $gbifDatasetKey, 
    q: $q, 
    countriesOfResearcher: $countriesOfResearcher, 
    countriesOfCoverage: $countriesOfCoverage, 
    literatureType: $literatureType, 
    year: $year, 
    relevance: $relevance, 
    topics: $topics, 
    publishingOrganizationKey: $publishingOrganizationKey, 
    peerReview: $peerReview, 
    openAccess: $openAccess, 
    gbifDownloadKey: $gbifDownloadKey, 
    doi: $doi, 
    source: $source, 
    publisher: $publisher
    limit: $limit, 
    offset: $offset
    ) {
    count
    offset
    limit
    results {
      title
      abstract
      authors {
        firstName
        lastName
      }
      literatureType
      year
    }
  }
}

`;

const defaultTableConfig = {
  onSelect: ({key}) => {
    window.location = `/literature/${key}`
  },
  columns: [
    {
      trKey: 'title',
      value: {
        key: 'title',
        formatter: (value, item) => {
          const maxLength = 200;
          const truncatedAbstract = item.abstract.length > maxLength ? `${item.abstract.substr(0,maxLength)}...` : item.abstract;
          return <div>
            <div>{value}</div>
            <div style={{color: '#aaa'}}>{truncatedAbstract}</div>
          </div>
        },
      },
      width: 'wide'
    },
    {
      trKey: 'literatureType',
      value: {
        key: 'literatureType',
        labelHandle: 'literatureType',
        hideFalsy: true
      }
    },
    {
      trKey: 'year',
      value: {
        filterKey: 'year',
        key: 'year',
        hideFalsy: true
      }
    },
    // {
    //   trKey: 'tableHeaders.occurrences',
    //   value: {
    //     key: 'occurrenceCount',
    //     formatter: (value, item) => <FormattedNumber value={value} />,
    //     hideFalsy: true,
    //     rightAlign: true
    //   }
    // },
    // {
    //   trKey: 'active',
    //   value: {
    //     key: 'active',
    //     formatter: (value, item) => value ? 'yes' : 'no'
    //   }
    // }
  ]
};

function Table() {
  // const history = useHistory();
  const routeContext = useContext(RouteContext);

  function onSelect({key}) {
    const path = routeContext.literatureKey.url({key});
    console.log(path);
    window.location = path;
    // if (history && !useWindowLocation) {
    //   history.push(path);
    // } else {
    //   
    // }
  }

  return <StandardSearchTable onSelect={onSelect} graphQuery={QUERY} resultKey='literatureSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;