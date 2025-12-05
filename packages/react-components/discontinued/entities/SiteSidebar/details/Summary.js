import React, {useContext, useEffect, useState} from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import {useQuery} from "../../../dataManagement/api";
import {Summaries} from "./Summaries";

export function Summary({
  locationID,
  year,
  month,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const { data, error, loading, load } = useQuery(FACET_BREAKDOWN, { lazyLoad: true });

  useEffect(() => {
    if (typeof locationID !== 'undefined') {
      
      const singlePredicate = {
          key:  "locationID", type: "equals", value: locationID
      }

      const predicateYear = {
        type: 'and',
        predicates: [
          { key:  "locationID", type: "equals", value: locationID},
          { key:  "year", type: "equals", value: year}
        ]
      }        

      const predicateYearMonth = {
        type: 'and',
        predicates: [
          { key:  "locationID", type: "equals", value: locationID},
          { key:  "year", type: "equals", value: year},
          { key:  "month", type: "equals", value: month}
        ]
      }      

      let predicate = singlePredicate;
      if (month >= 0){
        predicate = predicateYearMonth;
      } else if (year){
        predicate = predicateYear;
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
    predicate: $predicate,
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
      kingdomKey {
        count
        key
      }
      phylumKey {
        count
        key
      }               
      orderKey {
        count
        key
      }     
      classKey {
        count
        key
      }    
      familyKey {
        count
        key
      }
      genusKey {
        count
        key
      }  
      speciesKey {
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
