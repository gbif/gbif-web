import React from "react";
import { ErrorBoundary } from "../../../../components";
import PredicateDataFetcher from "../../../PredicateDataFetcher";
import {List} from "./List";

const DOWNLOADS_QUERY = `
query downloads($predicate: Predicate, $limit: Int){
  downloadsList: eventSearch(
    predicate:$predicate,
    ) {
    facet {
      datasetKey(size: $limit) {
        datasetTitle
        count
        key
        archive {
          url
          fileSizeInMB
          modified          
        }
        events {
          documents(size: 3) {
            total
          }
        }
      }
    }
  }
}
`;
function Table() {
  return <PredicateDataFetcher
      queryProps={{ throwAllErrors: true }}
      graphQuery={DOWNLOADS_QUERY}
      queryTag='download'
      limit={50}
      presentation={List}
  />
}

export default props => <ErrorBoundary><Table {...props} /></ErrorBoundary>;

