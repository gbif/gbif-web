import React, { useEffect, useState, useContext } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import SearchContext from '../../../SearchContext';
import { Button, Row, Col } from '../../../../components';
import { ResultsHeader } from '../../../ResultsHeader';
import { useQuery } from '../../../../dataManagement/api';

export const List = ({ first, prev, next, size, from, data, total, loading }) => {
  const { filters, labelMap } = useContext(SearchContext);

  const datasets = data?.eventSearch?.facet?.datasetKey;

  if (!data || loading) return null;

  return <div style={{
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column",
  }}>
    {/* <ResultsHeader loading={loading} total={total} /> */}
    <ul style={{ flex: "1 1 auto", height: 100, display: 'flex', flexDirection: 'column' }}>
      {datasets.map(x => <Dataset {...x} datasetKey={x.key} />)}
    </ul>
  </div>
}

const DATASET_QUERY = `
query list($datasetKey: JSON){
  eventSearch(predicate: {type: equals, key: "datasetKey", value: $datasetKey}) {
    documents(size: 1) {
      total
      results {
        datasetTitle
        datasetKey
      }
    }
    facet {
      samplingProtocol {
        key
        count
      }
      measurementOrFactTypes {
        key
        count
      }
    }
  }
}
`;

function Dataset({ datasetKey, datasetTitle, count, events, ...props }) {
  const { data, error, loading, load } = useQuery(DATASET_QUERY, { lazyLoad: true });

  useEffect(() => {
    load({ keepDataWhileLoading: true, variables: { datasetKey } });
  }, [datasetKey]);

  if (!data || loading) return null;

  const {documents, facet} = data.eventSearch;

  return <article>
    <div>
      <h2>{datasetTitle}</h2>
      <div>
        <div>Total events: {documents.total}</div>
        <div>Protocols: {facet.samplingProtocol.map(x => x.key).join(', ')}</div>
        <div>measurement types: {facet.measurementOrFactTypes.map(x => x.key).join(', ')}</div>
      </div>
    </div>
    <div>
      Matched events: {count}
      <ul>
        {events.documents.results.map(x => {<li>{x.eventId}</li>})}
      </ul>
    </div>
  </article>
}