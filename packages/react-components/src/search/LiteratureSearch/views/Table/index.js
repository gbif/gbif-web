import React, { useContext, useEffect, useState } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { MdLink} from 'react-icons/md'

import axios from '../../../../dataManagement/api/axios';

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
      identifiers {
        doi
      }
      websites
    }
  }
}

`;

function AltmetricDonut({doi, ...props}) {
  const [donut, setDonut] = useState();
  // https://api.altmetric.com/v1/doi/10.1636/joa-s-20-053
  useEffect(() => {
    const response = axios.get(`https://api.altmetric.com/v1/doi/${doi}`);
    response
      .promise
      .then(response => {
        setDonut(response.data);
      });
  });

  if (!doi || !donut) return null;
  return <a href={donut.details_url}>
    <img src={donut.images.medium} width={50}/>
  </a>
}

function getLink(item) {
  if (item.identifiers.doi) {
    return `https://doi.org/${item.identifiers.doi}`;
  }
  return item.websites[0];
}

const defaultTableConfig = {
  onSelect: ({key}) => {
    window.location = `/literature/${key}`
  },
  columns: [
    {
      trKey: 'tableHeaders.title',
      value: {
        key: 'title',
        formatter: (value, item) => {
          const maxLength = 200;
          const truncatedAbstract = item.abstract?.length > maxLength ? `${item.abstract.substr(0,maxLength)}...` : item.abstract;
          const link = getLink(item);
          
          return <div>
            {link ? <div><a href={link} style={{color: 'inherit', textDecoration: 'none'}}>{value} <MdLink /></a></div> : <div>{value}</div>}
            
            <div style={{color: '#aaa'}}>{truncatedAbstract}</div>
          </div>
        },
      },
      width: 'wide'
    },
    {
      trKey: 'altmetric',
      value: {
        key: 'identifiers',
        formatter: (value, item) => {
          return <AltmetricDonut doi={item?.identifiers?.doi}/>
        },
        hideFalsy: true
      }
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
      trKey: 'filter.year.name',
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
  return <StandardSearchTable graphQuery={QUERY} resultKey='literatureSearch' defaultTableConfig={defaultTableConfig}/>
}

export default Table;