import React, {useContext, useEffect, useState} from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import {useQuery} from "../../../dataManagement/api";
import {Summaries} from "./Summaries";

export function Summary({
  locationID,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const { data, error, loading, load } = useQuery(FACET_BREAKDOWN, { lazyLoad: true, graph: 'EVENT' });

  useEffect(() => {
    if (typeof locationID !== 'undefined') {
      const predicate = {
          key:  "locationID",
          type: "equals",
          value: locationID
      }
      load({ keepDataWhileLoading: true, variables: { predicate, size: 0, from: 0 } });
    }
  }, [locationID]);
  if (loading || !data) {
    return <h2>Loading summary information for site...</h2>;
  }
  return <Summaries data={data} showAll={showAll}  />
};

const FACET_BREAKDOWN = `
query list($predicate: Predicate, $offset: Int, $limit: Int){
  results: eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $offset
    ) {
    facet {
      eventHierarchy {
        count
        key
      }
      eventHierarchyJoined {
        count
        key
      }
      eventTypeHierarchy {
        count
        key
      }
      eventTypeHierarchyJoined {
        count
        key
      }
      samplingProtocol {
        count
        key
      }
      measurementOrFactTypes {
        count
        key
      }
    }       
    occurrenceFacet {
      kingdom {
        count
        key
      }
      phylum {
        count
        key
      }               
      order {
        count
        key
      }     
      class {
        count
        key
      }    
      family {
        count
        key
      }
      genus {
        count
        key
      }      
      samplingProtocol {
        count
        key
      }  
      recordedBy {
        count      
        key
      }           
    }
  }
}
`;
