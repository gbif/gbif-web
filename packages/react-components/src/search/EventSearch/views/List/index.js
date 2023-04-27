import React from "react";
import PredicateDataFetcher from '../../../PredicateDataFetcher';
import { List } from './List';
import { ErrorBoundary} from '../../../../components';

const DATASETS_QUERY = `
query list($predicate: Predicate, $limit: Int){
  eventSearch(
    predicate:$predicate,
    ) {
    facet {
      datasetKey(size: $limit) {
        datasetTitle
        count
        key
        occurrenceCount        
        events {
          documents(size: 3) {
            total
            results {
              eventID
              samplingProtocol
              eventType {
                concept
              }
              year
              formattedCoordinates
              stateProvince
            }
          }
        }
      }
    }
  }
}
`;

function Table() {
  return <PredicateDataFetcher
    queryProps={{throwAllErrors: true}}
    graphQuery={DATASETS_QUERY}
    queryTag='datasets'
    limit={50}
    presentation={List}
  />
}

export default props => <ErrorBoundary><Table {...props} /></ErrorBoundary>;