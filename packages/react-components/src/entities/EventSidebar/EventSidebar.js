import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { Intro } from './details/Intro';
import { DistinctTaxa } from './taxa/DistinctTaxa';
import { Header } from './Header';
import { MdClose, MdInfo, MdImage } from "react-icons/md";

const { TabList, Tab, TapSeperator } = Tabs;
const { TabPanel } = Tabs;

export function EventSidebar({
  onCloseRequest,
  setActiveEvent,
  addToSearch,
  addEventTypeToSearch,
  eventID,
  datasetKey,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(EVENT, { lazyLoad: true });
  const [activeId, setTab] = useState( 'details');
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof eventID !== 'undefined') {
      load({ variables: { eventID: eventID, datasetKey: datasetKey } });
    }
  }, [eventID, datasetKey]);

  useEffect(() => {
    if (!loading) {
      setTab('details');
    }
  }, [data, loading]);

  const isLoading = loading || !data;

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
          {data?.event?.distinctTaxa?.length > 0 && (
            <Tab tabId="distinctTaxa" direction="left">
              <MdImage />
            </Tab>
          )}
        </TabList>
      </Col>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        {isLoading && <Col style={{ padding: '12px', paddingBottom: 50, overflow: 'auto' }} grow>
          <h2>{eventID} - Loading event information...</h2>
        </Col>}
        {!isLoading &&
            <>
              <Header data={data} error={error} />
              <TabPanel tabId='details'>
                <Intro
                    data={data}
                    loading={loading}
                    error={error}
                    setActiveEvent={setActiveEvent}
                    addToSearch={addToSearch}
                    addEventTypeToSearch={addEventTypeToSearch}
                />
              </TabPanel>
              <TabPanel tabId='distinctTaxa'>
                <DistinctTaxa data={data} loading={loading} error={error} />
              </TabPanel>
            </>
        }
      </Col>
    </Row>
  </Tabs>
};

const EVENT = `
query event($eventID: String, $datasetKey: String){
  event(eventID: $eventID, datasetKey: $datasetKey) {
    eventID
    parentEventID
    eventType {
      concept
    }
    eventName
    coordinates
    countryCode
    datasetKey
    datasetTitle
    year
    month
    occurrenceCount
    measurementOrFactTypes
    measurementOrFactCount
    sampleSizeUnit
    sampleSizeValue
    samplingProtocol
    eventTypeHierarchyJoined
    eventHierarchyJoined
    eventTypeHierarchy
    eventHierarchy    
    eventTypeHierarchy
    eventHierarchy
    decimalLatitude
    decimalLongitude
    locality
    stateProvince
    locationID
    wktConvexHull
    temporalCoverage {
      gte
      lte
    }
    distinctTaxa {
      scientificName
      key
      kingdom
      phylum
      class
      order
      family
      genus
      species
      count
    }
  }
}
`;


