import React, {useContext, useEffect, useState} from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import {Row, Col, Tabs} from "../../components";
import { useQuery } from '../../dataManagement/api';
import {TabPanel} from "../../components/Tabs/Tabs";

export function SiteSidebar({
  onCloseRequest,
  locationID,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(EVENT, { lazyLoad: true, graph: 'EVENT' });
  const theme = useContext(ThemeContext);
  const [activeId, setTab] = useState( 'details');

  useEffect(() => {
    if (!loading) {
      setTab('details');
    }
  }, [data, loading]);

  return <Tabs  activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='details' style={{height: '100%'}}>
          <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
            <Col style={{ padding: '12px', paddingBottom: 50, overflow: 'auto' }} grow>
              <h2> Site </h2>
              <p>
                TO BE ADDED - Breakdown that includes:
                <ul>
                  <li>Map of the site</li>
                  <li>Datasets with events at this site</li>
                  <li>Event types record</li>
                  <li>Temporal range, year and month</li>
                  <li>Taxonomic range</li>
                  <li>Measurement types</li>
                </ul>
              </p>
            </Col>
          </Row>
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};

const EVENT = `
query event($eventID: String, $datasetKey: String){
  event(eventID: $eventID, datasetKey: $datasetKey) {
    eventId
    parentEventId
    eventType {
      concept
    }
    coordinates
    countryCode
    datasetKey
    datasetTitle
    kingdoms
    phyla
    classes
    orders
    families
    genera
    year
    month
    occurrenceCount
    measurementOrFactTypes
    measurementOrFactCount
    sampleSizeValue
    samplingProtocol
    eventTypeHierarchyJoined
    eventHierarchyJoined
    decimalLatitude
    decimalLongitude
    locality
    stateProvince
    locationID
  }
}
`;


