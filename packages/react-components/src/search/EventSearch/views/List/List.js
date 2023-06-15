import { css} from '@emotion/react';
import React, { useEffect, useCallback, useState, useContext } from 'react';
import { useUpdateEffect } from 'react-use';
import SearchContext from '../../../SearchContext';
import {Button, Skeleton, DetailsDrawer, Row, Col, Tag, Tags, ResourceLink} from '../../../../components';
import { useQuery } from '../../../../dataManagement/api';
import * as style from './style';
import { FilterContext } from "../../../../widgets/Filter/state";
import { EventDatasetSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { useQueryParam, StringParam } from 'use-query-params';
import {useGraphQLContext} from "../../../../dataManagement/api/GraphQLContext";
import {ResultsHeader} from "../../../ResultsHeader";
import {
  GiPlantsAndAnimals,
  MdAccountTree,
  MdLocationPin,
  MdOutlineDeviceHub,
  MdOutlineDeviceThermostat,
  RiSurveyLine
} from "react-icons/all";
import {MdEvent, MdOutbound} from "react-icons/md";
import {OccurrenceDatasetSearchLink} from "../../../../components/resourceLinks/resourceLinks";

export const List = ({query, first, prev, next, size, from, data, total, loading }) => {
  const { filters } = useContext(SearchContext);
  const dialog = useDialogState({ animated: true, modal: false });
  const [activeKey, setActiveKey] = useQueryParam('entity', StringParam);

  const datasets = data?.eventSearch?.facet?.datasetKey;

  const noOfDatasets = data?.eventSearch?.cardinality.datasetKey;

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
      <EventDatasetSidebar id={activeKey} defaultTab='details' style={{ maxWidth: '100%', height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>}
    <ResultsHeader loading={loading} total={noOfDatasets} />
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
      surveyID
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
      kingdom {
        key
      } 
      phylum {
        key
      }            
      class {
        key
      } 
      order {
        key
      }         
      family {
        key
      }    
      genus {
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
    <Skeleton width="random" style={{ marginBottom: '30px', width: '50%'}}  />
    <div css={style.details}>
      <div css={style.details_col1}>
        <Skeleton width="random" />
        <Skeleton width="random" />
        <Skeleton width="random" />
        <Skeleton width="random" />
      </div>
      <div css={style.details_col2}>
        <Skeleton width="random" />
        <Skeleton width="random" />
        <Skeleton width="random" style={{ marginTop: '20px'}} />
        <Skeleton width="random" />
      </div>
      <div css={style.details_col3}>
        <Skeleton width="random" />
        <Skeleton width="random" />
        <Skeleton width="random" />
      </div>
    </div>
  </div>
}

function Dataset({ datasetKey, datasetTitle, count, occurrenceCount, extensions, events, onClick, filters, ...props }) {
  const { data, error, loading, load } = useQuery(DATASET_QUERY, { lazyLoad: true });
  const currentFilterContext = useContext(FilterContext);
  const [activeView,  setActiveView] = useQueryParam('view', StringParam);

  useEffect(() => {
    load({ keepDataWhileLoading: true, variables: { datasetKey } });
  }, [datasetKey]);

  if (!data || loading) return <DatasetSkeleton />;



  const filterByThisDataset = () => {
    currentFilterContext.setField('datasetKey', [datasetKey], true)
  }

  const viewSitesForDataset = () => {
    currentFilterContext.setField('datasetKey', [datasetKey], true)
    setActiveView("SITES")
  }

  const viewSurveysForDataset = () => {
    currentFilterContext.setField('datasetKey', [datasetKey], true)
    setActiveView("SURVEYS")
  }

  const viewEventsForDataset = () => {
    currentFilterContext.setField('datasetKey', [datasetKey], true)
    setActiveView("EVENTS")
  }

  const addMofFilter = (mof) => {
    currentFilterContext.setField('measurementOrFactTypes', [mof], true)
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

  function getSensibleLevel(occurrenceFacet){
    let levels = Array("kingdom", "phylum", "class", "order", "family", "genus");
    let result = occurrenceFacet[levels[0]];
    for (var i = 1; i < levels.length; i++){
      if (occurrenceFacet[levels[i]] && occurrenceFacet[levels[i]].length < 20){
        result = occurrenceFacet[levels[i]];
      } else {
        break;
      }
    }
    return result;
  }

  function getLastPartOfURL(url) {
    const parsedURL = new URL(url);
    const pathname = parsedURL.pathname;
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart;
  }

  return <article>
    <div css={style.summary} >
      <Button look="link">
        <h2 style={{ fontSize: "20px"}} onClick={onClick}>{datasetTitle}</h2>
      </Button>
      <div css={style.details}>
        <div css={style.details_col1}>
            <div>
              <MdEvent /> Events:
              <span>
                <a href="#" css={style.discreet_link} onClick={() => viewEventsForDataset()}>{documents.total?.toLocaleString()}</a>
              </span>
            </div>
            <div><GiPlantsAndAnimals /> Occurrences: <span>
                <OccurrenceDatasetSearchLink id={datasetKey}>{occurrenceCount?.toLocaleString()} <MdOutbound /></OccurrenceDatasetSearchLink>
            </span></div>
            {cardinality.surveyID > 0 &&
                <div>
                  <RiSurveyLine /> Surveys:
                  <span><a href="#" css={style.discreet_link} onClick={() => viewSurveysForDataset()}>{cardinality.surveyID?.toLocaleString()}</a></span>
                </div>
            }
            <div>
                <MdLocationPin /> Sites: <span>
                  <a href="#" css={style.discreet_link} onClick={() => viewSitesForDataset()}>{cardinality.locationID?.toLocaleString()}</a>
              </span>
            </div>
        </div>
        <div css={style.details_col2}>
          <div style={{ marginBottom: '10px'}}><MdOutlineDeviceHub/> Taxonomy</div>
          <div>
             <Tags style={{fontSize: '18px'}}>
                { getSensibleLevel(occurrenceFacet).map(x => <Tag key={x.key} type="light" outline={true}>{x.key}</Tag>) }
             </Tags>
          </div>
          {hasMeasurements &&
            <div style={{ marginTop: '25px'}}>
              <div style={{ marginBottom: '10px'}}>
                <MdOutlineDeviceThermostat/> Measurements</div>
              <div>
                <Tags style={{fontSize: '14px'}}>
                  {facet.measurementOrFactTypes.map(x =>
                      <Tag key={x.key}  type="light" outline={true} >
                        <a href="#" css={style.discreet_link} onClick={() => addMofFilter(x.key)}>
                          {x.key}
                        </a>
                        </Tag>
                  )}
                </Tags>
              </div>
            </div>
          }
        </div>
        <div css={style.details_col3}>
          <div style={{ marginBottom: '10px'}}><MdAccountTree style={{fontSize: '12px'}} /> Data extensions</div>
          <div>
            <Tags style={{fontSize: '18px'}}>
              { extensions.map(x => <><Tag key={x} type="light" outline={true}>{getLastPartOfURL(x)}</Tag><br/></>) }
            </Tags>
          </div>
        </div>
      </div>
      <Button
          onClick={() => filterByThisDataset()}
          look="primaryOutline"
          css={css` margin-top: 10px; font-size: 14px;`}>Add to filter</Button>
    </div>
  </article>
}