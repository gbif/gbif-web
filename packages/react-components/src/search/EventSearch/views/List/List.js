import { jsx } from '@emotion/react';
import React, { useEffect, useState, useContext } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import SearchContext from '../../../SearchContext';
import { Button, Row, Col, Skeleton } from '../../../../components';
import { ResultsHeader } from '../../../ResultsHeader';
import { useQuery } from '../../../../dataManagement/api';
import * as style from './style';

export const List = ({ first, prev, next, size, from, data, total, loading }) => {
  const { filters, labelMap } = useContext(SearchContext);

  const datasets = data?.eventSearch?.facet?.datasetKey;

  if (!data || loading) return <><DatasetSkeleton /><DatasetSkeleton /><DatasetSkeleton /></>;

  return <div style={{
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column",
  }}>
    {/* <ResultsHeader loading={loading} total={total} /> */}
    <ul css={style.datasetList}>
      {datasets.map(x => <li style={{marginBottom: 12}} key={x.key}><Dataset {...x} datasetKey={x.key} /></li>)}
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
    stats {
      occurrenceCount {
        sum
      }
    }
  }
}
`;

function DatasetSkeleton() {
  return <div css={style.datasetSkeleton}>
     <Skeleton width="random" style={{height: '1.5em'}}/>
     <Skeleton width="random" />
     <Skeleton width="random" />
     <Skeleton width="random" />
  </div>
}
function Dataset({ datasetKey, datasetTitle, count, events, ...props }) {
  const { data, error, loading, load } = useQuery(DATASET_QUERY, { lazyLoad: true, graph: 'EVENT' });

  useEffect(() => {
    load({ keepDataWhileLoading: true, variables: { datasetKey } });
  }, [datasetKey]);

  if (!data || loading) return <DatasetSkeleton />;

  const {documents, facet, stats} = data.eventSearch;

  return <article>
    <div css={style.summary}>
      <h2>{datasetTitle}</h2>
      <div css={style.details}>
        <div>Published by: <span>{documents.results[0].publisherTitle}</span></div>
        <div>Total events: <span>{documents.total}</span></div>
        <div>Total occurrences: <span>{stats.occurrenceCount.sum}</span></div>
        <div>Protocols: <span>{facet.samplingProtocol.map(x => x.key).join(' • ')}</span></div>
        <div>measurement types: <span>{facet.measurementOrFactTypes.map(x => x.key).join(' • ')}</span></div>
      </div>
    </div>
    <div css={style.events}>
      <div css={style.tabularListItem}>
        <div>Event ID</div>
        <div>Year</div>
        <div>Coordinates</div>
        <div>Occurrences</div>
      </div>
      <ul css={style.eventList}>
        {events.documents.results.map(x => <li key={x.eventId}>
          <div>
            <div>{x.eventId}</div>
            <div>{x.year}</div>
            <div>{x.formattedCoordinates}</div>
            <div>{x.occurrenceCount}</div>
          </div>
        </li>)}
      </ul>
      <div style={{color: '#888', fontSize: '0.85em'}}>Matched events: {count}</div>
    </div>
  </article>
}