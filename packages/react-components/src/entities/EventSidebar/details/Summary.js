import React, {useContext, useEffect, useState} from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import {Summaries} from "./Summaries";
import {useQuery} from "../../../dataManagement/api";

export function Summary({
  event,
  setActiveEvent,
  addToSearch,
  addEventTypeToSearch,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const { data, error, loading, load } = useQuery(FACET_BREAKDOWN, { lazyLoad: true });

  useEffect(() => {
    if (typeof event !== 'undefined' && typeof event.eventID !== 'undefined') {
      const predicate1 = {
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

      const predicate2 = {
        type: 'and',
        predicates: [
          {
            key: "eventHierarchy",
            type: "equals",
            value: event.eventID
          },
          {
            key: "measurementOrFactTypes",
            type: "isNotNull"
          }
          ,{
            key:  "datasetKey",
            type: "equals",
            value: event.datasetKey
          }]
      }
      load({ keepDataWhileLoading: true, variables: { predicate1: predicate1, predicate2: predicate2, size: 0, from: 0 } });
    }
  }, [event]);

  if (loading || !data) {
    return <h2>Loading summary information...</h2>;
  }

  return <Summaries event={event}
                    setActiveEvent={setActiveEvent}
                    addToSearch={addToSearch}
                    addEventTypeToSearch={addEventTypeToSearch}
                    data={data}
                    showAll={showAll}  />
};

const FACET_BREAKDOWN = `
query list($predicate1: Predicate, $predicate2: Predicate, $offset: Int, $limit: Int){

  mofResults: eventSearch(predicate: $predicate2){
      facet {
        eventTypeHierarchyJoined {
          key
          count
        }  
      }
  }

  results: eventSearch(
    predicate:$predicate1,
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
      species {
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
      recordedById {
        count
        key
      }
      identifiedBy {
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
