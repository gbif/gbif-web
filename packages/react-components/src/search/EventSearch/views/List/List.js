import { css, jsx } from '@emotion/react';
import React, { useEffect, useCallback, useState, useContext } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import { useUpdateEffect } from 'react-use';
import get from 'lodash/get';
import SearchContext from '../../../SearchContext';
import { Button, Row, Col, Skeleton, DetailsDrawer } from '../../../../components';
import { ResultsHeader } from '../../../ResultsHeader';
import { useQuery } from '../../../../dataManagement/api';
import * as style from './style';
import { FilterContext } from "../../../../widgets/Filter/state";
import { EventDatasetSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { useQueryParam, NumberParam } from 'use-query-params';

export const List = ({ first, prev, next, size, from, data, total, loading }) => {
  const { filters, labelMap } = useContext(SearchContext);
  const dialog = useDialogState({ animated: true, modal: false });
  const [activeKey, setActiveKey] = useQueryParam('entity', NumberParam);

  const datasets = data?.eventSearch?.facet?.datasetKey;

  useEffect(() => {
    if (activeKey) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [activeKey]);

  useUpdateEffect(() => {
    if (!dialog.visible) {
      setActiveKey();
    }
  }, [dialog.visible]);

  const nextItem = useCallback(() => {
    // const activeIndex = items.findIndex(x => x.key === activeKey);
    // const next = Math.min(items.length - 1, activeIndex + 1);
    // if (items[next]) {
    //   setActiveKey(items[next].key);
    // }
  }, [activeKey, datasets]);

  const previousItem = useCallback(() => {
    // const activeIndex = items.findIndex(x => x.key === activeKey);
    // const prev = Math.max(0, activeIndex - 1);
    // if (items[prev]) {
    //   setActiveKey(items[prev].key);
    // }
  }, [activeKey, datasets]);
  
  if (!data || loading) return <><DatasetSkeleton /><DatasetSkeleton /><DatasetSkeleton /></>;

  return <div style={{
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column",
  }}>
    {dialog.visible && <DetailsDrawer dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <EventDatasetSidebar id={activeKey} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>}
    {/* <ResultsHeader loading={loading} total={total} /> */}
    <ul css={style.datasetList}>
      {datasets.map(x => <li style={{ marginBottom: 12 }} key={x.key}><Dataset {...x} datasetKey={x.key} filters={filters} onClick={() => { setActiveKey(x.key); }}/></li>)}
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
        occurrenceCount
      }
    }
    facet {
      measurementOrFactTypes {
        key
      }  
      samplingProtocol {
        key
      }    
      eventTypeHierarchy {
        key
      }          
    }   
    occurrenceFacet {
      class {
        key
      }    
      samplingProtocol {
        key
      }
    }
  }
}
`;

function DatasetSkeleton() {
  return <div css={style.datasetSkeleton}>
    <Skeleton width="random" style={{ height: '1.5em' }} />
    <Skeleton width="random" />
    <Skeleton width="random" />
    <Skeleton width="random" />
  </div>
}
function Dataset({ datasetKey, datasetTitle, count, occurrenceCount, events, onClick, filters, ...props }) {
  const { data, error, loading, load } = useQuery(DATASET_QUERY, { lazyLoad: true, graph: 'EVENT' });
  const currentFilterContext = useContext(FilterContext);

  useEffect(() => {
    load({ keepDataWhileLoading: true, variables: { datasetKey } });
  }, [datasetKey]);

  if (!data || loading) return <DatasetSkeleton />;

  const filterByThisDataset = () => {
    currentFilterContext.setField('datasetKey', [datasetKey], true)
  }

  const { documents, occurrenceFacet, facet, stats } = data.eventSearch;
  const hasMeasurements = facet.measurementOrFactTypes != null && facet.measurementOrFactTypes.length > 0

  return <article>
    <div css={style.summary}>
      <h2 onClick={onClick}>{datasetTitle}</h2>
      <div style={{ float: 'right' }}>
        <Button
          onClick={() => filterByThisDataset()}
          look="primaryOutline"
          css={css`margin-left: 30px; font-size: 11px;`}>Add to filter</Button>
      </div>
      <div css={style.details}>
        <div>Total events: <span>{documents.total}</span></div>
        <div>Total occurrences: <span>{occurrenceCount}</span></div>
        <div>Taxonomic scope: <span>{occurrenceFacet.class.map(x => x.key).join(' • ')}</span></div>
        <div>Structure:&nbsp;
          <span>{facet.eventTypeHierarchy.map(x => x.key).join(' • ')}</span>
        </div>
        <div>Protocols:&nbsp;
          <span>{facet.samplingProtocol.map(x => x.key).join(' • ')}</span>
          <span>{occurrenceFacet.samplingProtocol.map(x => x.key).join(' • ')}</span>
        </div>
        {hasMeasurements &&
          <div>Measurement types: <span>{facet.measurementOrFactTypes.map(x => x.key).join(' • ')}</span></div>
        }
      </div>
    </div>
    <div css={style.events}>
      <div css={style.tabularListItem}>
        <div>Event ID</div>
        <div>Event type</div>
        <div>Year</div>
        <div>Coordinates</div>
      </div>
      <ul css={style.eventList}>
        {events.documents.results.map(x => <li key={x.eventID}>
          <div>
            <div>{x.eventID}</div>
            <div>{x.eventType?.concept}</div>
            <div>{x.year}</div>
            <div>{x.formattedCoordinates}</div>
          </div>
        </li>)}
      </ul>
      <div style={{ color: '#888', fontSize: '0.85em' }}>Matched events: {count}</div>
    </div>
  </article>
}