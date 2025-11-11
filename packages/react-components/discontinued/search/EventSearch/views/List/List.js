import { css} from '@emotion/react';
import React, { useEffect, useCallback, useState, useContext } from 'react';
import { useUpdateEffect } from 'react-use';
import SearchContext from '../../../SearchContext';
import { Button, Skeleton, DetailsDrawer } from '../../../../components';
import { useQuery } from '../../../../dataManagement/api';
import * as style from './style';
import { FilterContext } from "../../../../widgets/Filter/state";
import { EventDatasetSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { useQueryParam, StringParam } from 'use-query-params';
import {useGraphQLContext} from "../../../../dataManagement/api/GraphQLContext";

export const List = ({query, first, prev, next, size, from, data, total, loading }) => {
  const { filters, labelMap } = useContext(SearchContext);
  const dialog = useDialogState({ animated: true, modal: false });
  const [activeKey, setActiveKey] = useQueryParam('entity', StringParam);

  const datasets = data?.eventSearch?.facet?.datasetKey;

  const {details, setQuery} = useGraphQLContext();
  useEffect(() => {
    setQuery({ query, size, from });
  }, [query, size, from]);

  useEffect(() => {
    activeKey ? dialog.show() : dialog.hide();
  }, [activeKey]);

  useUpdateEffect(() => {
    if (!dialog.visible) {
      setActiveKey();
    }
  }, [dialog.visible]);

  const nextItem = useCallback(() => {
    const activeIndex = datasets.findIndex(x => x.key === activeKey);
    const next = Math.min(datasets.length - 1, activeIndex + 1);
    if (datasets[next]) {
      setActiveKey(datasets[next].key);
    }
  }, [activeKey, datasets]);

  const previousItem = useCallback(() => {
    const activeIndex = datasets.findIndex(x => x.key === activeKey);
    const prev = Math.max(0, activeIndex - 1);
    if (datasets[prev]) {
      setActiveKey(datasets[prev].key);
    }
  }, [activeKey, datasets]);
  
  if (!data || loading) return <><DatasetSkeleton /><DatasetSkeleton /><DatasetSkeleton /></>;

  if (!datasets || datasets.length == 0){
    return <>No datasets matching this search</>;
  }

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
    cardinality {
      locationID
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
      classKey {
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
  const { data, error, loading, load } = useQuery(DATASET_QUERY, { lazyLoad: true });
  const currentFilterContext = useContext(FilterContext);

  useEffect(() => {
    load({ keepDataWhileLoading: true, variables: { datasetKey } });
  }, [datasetKey]);

  if (!data || loading) return <DatasetSkeleton />;

  const filterByThisDataset = () => {
    currentFilterContext.setField('datasetKey', [datasetKey], true)
  }

  const { documents, occurrenceFacet, facet, stats, cardinality } = data.eventSearch;

  const hasMeasurements = facet.measurementOrFactTypes != null && facet.measurementOrFactTypes.length > 0;
  let hasStructure = facet.eventTypeHierarchy != null && facet.eventTypeHierarchy.length > 0;

  let structure = [];
  if (hasStructure){
    structure = facet.eventTypeHierarchy.map(x => x.key)
    if (occurrenceCount && occurrenceCount > 0){
      structure.push("Occurrence");
    }
  } else if (occurrenceCount && occurrenceCount > 0){
    structure.push("Occurrence");
    hasStructure = true;
  }

  return <article>
    <div css={style.summary}>
      <Button look="link"><h2 onClick={onClick}>{datasetTitle}</h2></Button>
      <div style={{ float: 'right' }}>
        <Button
          onClick={() => filterByThisDataset()}
          look="primaryOutline"
          css={css`margin-left: 30px; font-size: 11px;`}>Add to filter</Button>
      </div>
      <div css={style.details}>
        <div>Total events: <span>{documents.total?.toLocaleString()}</span></div>
        <div>Total occurrences: <span>{occurrenceCount?.toLocaleString()}</span></div>
        <div>Sites: <span>{cardinality.locationID?.toLocaleString()}</span></div>
        <div>Taxonomic scope: <span>{occurrenceFacet.classKey.map(x => x.key).join(' • ')}</span></div>
        {hasStructure &&
            <div>Structure:&nbsp;
              <span>{structure.join(' • ')}</span>
            </div>
        }
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
      <div style={{ color: '#888', fontSize: '0.85em' }}>Matched events: {count?.toLocaleString()}</div>
    </div>
  </article>
}