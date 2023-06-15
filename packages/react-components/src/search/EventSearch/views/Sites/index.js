import React from "react";
import SitesTable from "./SitesTable";
import {ErrorBoundary} from "../../../../components";
import PredicateDataFetcher from "../../../PredicateDataFetcher";

const SITES_QUERY = `
query list($predicate: Predicate, $size: Int = 30, $from: Int = 0){
  results: eventSearch(predicate:$predicate) {
    temporal {
      locationID(size: $size, from: $from) {
        cardinality
        results {
          key
          breakdown {
            y 
            c
            ms {
              m
              c
            }
          }
        } 
      }
    }
  }
  locations: eventSearch(predicate:$predicate) {
    multifacet(size: $size, from: $from) {
      locationIDStateProvince {
        keys
      }      
    }
  }
}
`;

function Table() {
  return <PredicateDataFetcher
      queryProps={{ throwAllErrors: true}}
      graphQuery={SITES_QUERY}
      queryTag='sites'
      presentation={SitesTable}
      predicateMeddler={(predicate) => {
        predicate.predicates.push({
          type: "isNotNull",
          key: "year"
        });
      }}
  />
}

export default props => <ErrorBoundary><Table {...props} /></ErrorBoundary>;
