import React, { useContext } from "react";
import RouteContext from '../../../../dataManagement/RouteContext';
import StandardSearch from '../../../StandardSearch';
import { ResultsList } from '../../../ResultsList';
// import { FormattedNumber } from 'react-intl';

const QUERY = `
query list($country: Country, $q: String, $offset: Int, $limit: Int){
  organizationSearch(isEndorsed: true, q: $q, limit: $limit, offset: $offset, country: $country) {
    count
    offset
    limit
    results {
      key
      title
      country
    }
  }
}
`;

function List() {
  const routeContext = useContext(RouteContext);
  
  return <StandardSearch 
    presentationComponent={ResultsList}
    cardComponent={props => {
    return <div key={props.result.key}>
      <h2>{props.result.title}</h2>
    </div>}
    }
    graphQuery={QUERY} 
    resultKey='organizationSearch' 
    />
}

export default List;