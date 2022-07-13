import React, {useContext, useEffect, useState} from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import {Row, Col, Tabs, Accordion, Properties} from "../../components";
import { useQuery } from '../../dataManagement/api';
import {TabPanel} from "../../components/Tabs/Tabs";
import {FormattedMessage} from "react-intl";
import {EnumField, PlainTextField} from "../EventSidebar/details/properties";
import Map from "./details/Map/Map";
import {Summary} from "./details/Summary";

export function SiteSidebar({
  onCloseRequest,
  siteID,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(SITE, { lazyLoad: true, graph: 'EVENT' });
  const theme = useContext(ThemeContext);
  const [activeId, setTab] = useState( 'details');
  const location  = data;

  useEffect(() => {
    if (typeof siteID !== 'undefined') {
      load({ variables: { locationID: siteID } });
    }
  }, [siteID]);

  useEffect(() => {
    if (!loading && location) {
      setTab('details');
      console.log(location);
    }
  }, [data, loading]);

  if (loading || !location) return <h2>Loading site information for {siteID} </h2>;

  return <Tabs  activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='details' style={{height: '100%'}}>
          <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
            <Col style={{ padding: '12px', paddingBottom: 50, overflow: 'auto' }} grow>
              <h2> Site: {siteID} </h2>
              <Group label={"Site location"}>
                <Properties css={css.properties} breakpoint={800}>
                  <PlainTextField term={ {simpleName: "locality", value: location?.location?.locality}} />
                  <PlainTextField term={ {simpleName: "stateProvince", value: location?.location?.stateProvince}} />
                  <EnumField term={ {simpleName: "country", value: location?.location?.countryCode}}
                             label="occurrenceFieldNames.country"  getEnum={value => `enums.countryCode.${value}`} />
                  <PlainTextField term={ {simpleName: "decimalLatitude", value: location?.location?.coordinates?.lat}} />
                  <PlainTextField term={ {simpleName: "decimalLongitude", value: location?.location?.coordinates?.lon}} />
                </Properties>
              </Group>
              <Group label={"Map of site location"}>
                <Map latitude={location?.location?.coordinates?.lat} longitude={location?.location?.coordinates?.lon} />
              </Group>
              <Summary locationID={siteID} />
            </Col>
          </Row>
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};

export function Group({ label, ...props }) {
  return <Accordion
      summary={<FormattedMessage id={label} />}
      defaultOpen={true}
      css={css.group()}
      {...props}
  />
}

const SITE = `
query location($locationID: String){
  location(locationID: $locationID) {
    coordinates
    countryCode
    locality
    stateProvince
    locationID
  }
}
`;


