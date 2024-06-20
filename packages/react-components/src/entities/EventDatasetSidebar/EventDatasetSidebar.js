
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo, MdClose } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { FormattedNumber } from 'react-intl';
import { Row, Col, Tabs, HyperText, Properties, DatasetKeyLink } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { Tree } from '../EventSidebar/details/Tree/Tree'

const { TabList, Tab, TabPanel, TapSeperator } = Tabs;
const { Term: T, Value: V } = Properties;

export function EventDatasetSidebar({
  onImageChange,
  onCloseRequest,
  id,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(DATASET, { lazyLoad: true });
  const [activeId, setTab] = useState(defaultTab || 'details');
  const theme = useContext(ThemeContext);
  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);



  const dataset = data?.eventSearch?.documents.results?.[0]?.dataset?.value;

  const isLoading = loading || !dataset;

  // get the hierarchy from
  const eventHierarchy = data?.eventSearch.facet.eventTypeHierarchyJoined;

  const mofHierarchy = data?.measurementOrFactHierarchy.facet.eventTypeHierarchyJoined;

  // get the hierarchy from
  const occurrenceHierarchy = data?.eventSearch.occurrenceFacet.eventTypeHierarchyJoined;

  let combinedHierarchy = [];

  if (eventHierarchy && occurrenceHierarchy) {
    eventHierarchy.forEach(h => combinedHierarchy.push(h));
    mofHierarchy.forEach(h => combinedHierarchy.push(
        {
          key: h.key + " / Measurement",
          count: h.count
        }));
    occurrenceHierarchy.forEach(h => {
      combinedHierarchy.push({
        key: h.key + " / Occurrence",
        count: h.count
      })
    });
  }

  return <Tabs activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerBar({ theme })}>
        <TabList style={{ paddingTop: '12px' }} vertical>
          {onCloseRequest && <>
            <Tab direction="left" onClick={onCloseRequest}>
              <MdClose />
            </Tab>
            <TapSeperator vertical />
          </>}
          <Tab tabId="details" direction="left">
            <MdInfo />
          </Tab>
        </TabList>
      </Col>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='details'>
          <Row direction="column">
            {isLoading && <Col style={{ padding: '12px 16px', paddingBottom: 50 }} grow>
              Loading
            </Col>}
            {!isLoading && <Col style={{ padding: '12px 16px', paddingBottom: 50 }} grow>
              <h1>{dataset.title}</h1>
              <DatasetKeyLink id={id}>Dataset detail page</DatasetKeyLink>

              <section style={{ marginTop: 36 }}>
                <Properties>
                  {dataset?.contact.length > 0 && <>
                    <T>Contacts</T>
                    <V>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {dataset?.contact.map(x => {
                          let contactName;
                          if (x.individualName) {
                            contactName = `${x.individualName[0].givenName} ${x.individualName[0].surName}`;
                          } else if (x.organizationName) {
                            contactName = x.organizationName;
                          }
                          return (
                            <span>
                              {contactName}
                              {x.electronicMailAddress && x.electronicMailAddress[0] && (
                                <>
                                  &nbsp;
                                  (<a href={`mailto:${x.electronicMailAddress[0]}`}>{x.electronicMailAddress[0]}</a>)
                                </>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </V>
                  </>}
                  {dataset?.abstract && <>
                    <T>Abstract</T>
                    <V><HyperText text={dataset.abstract} /></V>
                  </>}
                  {dataset?.purpose && <>
                    <T>Purpose</T>
                    <V><HyperText text={dataset.purpose} /></V>
                  </>}
                  {dataset?.intellectualRights && <>
                    <T>Intellectual rights</T>
                    <V>
                      <EMLLicence intellectualRights={dataset.intellectualRights} rights={dataset?.rights}/>
                    </V>
                  </>}
                  {dataset?.citation && <>
                    <T>Citation</T>
                    <V>
                      {dataset.citation}
                    </V>
                  </>}
                  {dataset?.methods.length > 0 && <>
                    <T>Methods</T>
                    {dataset.methods.map((method, i) => {
                      if (typeof method !== 'object') return <V>Unspecified</V>;
                      return <V key={i}>
                        <Properties horizontal={false}>
                          {method.methodStep && <><T>Methods steps</T>
                            {method.methodStep.map((step, j) => <V key={j}>{step.description[0].para[0]}</V>)}
                          </>}
                          {method.qualityControl && <><T>Methods steps</T>
                            {method.qualityControl.map((control, j) => <V key={j}>{control.description[0].para[0]}</V>)}
                          </>}
                        </Properties>
                      </V>
                    })}
                  </>}
                  {data.eventSearch?.stats.year?.min && <>
                    <T>Years</T>
                    <V>{data.eventSearch?.stats.year?.min} - {data.eventSearch?.stats.year?.max}</V>
                  </>}

                  <T>Occurrences</T>
                  <V><FormattedNumber value={data.eventSearch.stats.occurrenceCount.sum} /></V>

                  <T>Events</T>
                  <V><FormattedNumber value={data.eventSearch.documents.total} /></V>

                  {data.eventSearch?.cardinality.locationID > 0 && <>
                    <T>Known Locations</T>
                    <V><FormattedNumber value={data.eventSearch?.cardinality.locationID} /></V>
                  </>}

                  {data.eventSearch?.facet?.samplingProtocol?.length > 0 && <>
                    <T>Protocols</T>
                    <V>
                      <span>{data.eventSearch.facet.samplingProtocol.map(x => x.key).join(' • ')}</span>
                    </V>
                  </>}

                  {data.eventSearch?.facet?.measurementOrFactTypes?.length > 0 && <>
                    <T>Measurement types</T>
                    <V>
                      <span>{data.eventSearch.facet.measurementOrFactTypes.map(x => x.key).join(' • ')}</span>
                    </V>
                  </>}
                  {combinedHierarchy && <>
                    <T>Structure</T>
                    <V>
                      {data?.eventSearch && <Tree data={combinedHierarchy} highlightRootNode={true} theme={theme}/>}
                    </V>
                  </>}
                </Properties>
              </section>
            </Col>}
          </Row>
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};

export const EMLLicence = ({ intellectualRights, rights }) =>  {
  if (intellectualRights?.ulink && intellectualRights?.ulink.length > 0){
    let url = intellectualRights.ulink[0].$
    if (url){
      return <div><a href={url.url}>
        {intellectualRights.ulink[0].citetitle}
      </a>
        {rights &&
            <div>
              <span>{rights}</span>
            </div>
        }
      </div>
    } else {
      return intellectualRights.ulink[0].citetitle;
    }
  } else if (rights) {
    return rights;
  } else {
     return "No licence information available";
  }
}

const DATASET = `
query dataset($key: JSON!){
  measurementOrFactHierarchy: eventSearch(predicate: { type: and, 
        predicates: [
          {type: equals, key: "datasetKey", value: $key}, 
          {type: isNotNull, key: "measurementOrFactTypes"}
        ]
      }){
      facet {
        eventType {
          key
          count
        }       
        eventTypeHierarchyJoined {
          key
          count
        }  
      }
  }
  eventSearch: eventSearch(predicate: {type: equals, key: "datasetKey", value: $key}) {
    documents(size: 1) {
      total
      results {
        dataset
      }
    }
    stats {
      year {
        min
        max
      }
      occurrenceCount {
        sum
      }
    }
    cardinality {
      locationID
      speciesKey
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
      eventTypeHierarchyJoined {
        key
        count
      }        
    }   
    occurrenceFacet {
      familyKey {
        key
      }
      samplingProtocol {
        key
      }    
      eventTypeHierarchy {
        key
      }  
      eventTypeHierarchyJoined {
        key
        count
      }       
    }
  }
}
`;

