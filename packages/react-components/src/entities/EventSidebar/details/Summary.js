import React, {useContext, useEffect, useState} from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import { Row, Col, Switch } from "../../../components";
import { Header } from './Header';
import { Groups } from './Groups';
import {Summaries} from "./Summaries";
import {useQuery} from "../../../dataManagement/api";

export function Summary({
  eventID,
  datasetKey,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const { data, error, loading, load } = useQuery(FACET_BREAKDOWN, { lazyLoad: true, graph: 'EVENT' });

  useEffect(() => {
    if (typeof eventID !== 'undefined') {
      const predicate = {
        type: 'and',
        predicates: [{
          key:  "eventHierarchy",
          type: "equals",
          value: eventID
        },{
          key:  "datasetKey",
          type: "equals",
          value: datasetKey
        }]
      }
      load({ keepDataWhileLoading: true, variables: { predicate, size: 0, from: 0 } });
    }
  }, [eventID, datasetKey]);

  if (loading || !data) {
    return <h2>Loading summary information...</h2>;
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
      kingdoms {
        count
        key
      }
      phyla {
        count
        key
      }
      classes {
        count
        key
      }
      families {
        count
        key
      }
      genera {
        count
        key
      }
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
    }
  }
}
`;
