import React, {useContext, useEffect, useState} from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import {Summaries} from "./Summaries";
import {useQuery} from "../../../dataManagement/api";

export function Summary({
  event,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const { data, error, loading, load } = useQuery(FACET_BREAKDOWN, { lazyLoad: true, graph: 'EVENT' });

  useEffect(() => {
    if (typeof event !== 'undefined' && typeof event.eventID !== 'undefined') {
      const predicate = {
        type: 'and',
        predicates: [
          {
            key: "eventHierarchy",
            type: "equals",
            value: event.eventID
          }
         ,{
          key:  "datasetKey",
          type: "equals",
          value: event.datasetKey
        }]
      }
      load({ keepDataWhileLoading: true, variables: { predicate, size: 0, from: 0 } });
    }
  }, [event]);

  if (loading || !data) {
    return <h2>Loading summary information...</h2>;
  }

  return <Summaries event={event} data={data} showAll={showAll}  />
};

const FACET_BREAKDOWN = `
query list($predicate: Predicate, $offset: Int, $limit: Int){
  results: eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $offset
    ) {
    documents(size: 1) {
      total
      results {
        datasetTitle
        datasetKey
        occurrenceCount
        eventType {
          concept
        }
        measurementOrFacts {
          measurementID
          measurementType
          measurementValue
          measurementUnit
        }        
      }
    }    
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
      basisOfRecord {
        count
        key
      } 
      month {
        count
        key
      }  
      year {
        count
        key
      }                  
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
      eventTypeHierarchy {
        key
      }  
      eventTypeHierarchyJoined {
        key
        count
      }                    
    }
  }
}
`;
