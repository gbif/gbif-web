import React, { useContext, useEffect, useState } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Tabs, Accordion, Properties, Eyebrow } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { TabPanel } from "../../components/Tabs/Tabs";
import  { useIntl, FormattedMessage } from "react-intl";
import { EnumField, PlainTextField } from "../EventSidebar/details/properties";
import Map from "./details/Map/Map";
import { Summary } from "./details/Summary";
import {MdClose, MdInfo} from "react-icons/md";
const { TabList, Tab, TapSeperator } = Tabs;

export function SiteSidebar({
  onCloseRequest,
  siteID,
  year,
  month,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(SITE, { lazyLoad: true });
  const theme = useContext(ThemeContext);
  const [activeId, setTab] = useState('details');
  const location = data;

  useEffect(() => {
    if (typeof siteID !== 'undefined') {
      load({ variables: { locationID: siteID } });
    }
  }, [siteID]);

  useEffect(() => {
    if (!loading && location) {
      setTab('details');
    }
  }, [data, loading]);

  const isLoading = loading || !location;

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
        {isLoading && (
          <Col style={{ padding: '12px', paddingBottom: 50, overflow: 'auto' }} grow>
            <h2><FormattedMessage id={`eventDetails.siteLoading`} values={{siteID: siteID}} /></h2>
            <TemporalDisplay year={year} month={month} />
          </Col>
        )}
            {!isLoading && (
              <TabPanel tabId="details" style={{ height: '100%' }}>
                <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
                  <Col style={{ paddingBottom: 50, overflow: 'auto' }} grow>
                    <Row wrap="no-wrap" css={css.header({ theme })}>
                      <Col grow>
                        <h1><FormattedMessage id={`eventDetails.site`}  values={{siteID: siteID}}/></h1>
                        <TemporalDisplay year={year} month={month} />
                      </Col>
                    </Row>
                    <Group label={"eventDetails.siteLocation"}>
                      <Properties css={css.properties} breakpoint={800}>
                        <PlainTextField term={{ simpleName: "locality", value: location?.location?.locality }} />
                        <PlainTextField term={{ simpleName: "stateProvince", value: location?.location?.stateProvince }} />
                        <EnumField term={{ simpleName: "country", value: location?.location?.countryCode }}
                          label="occurrenceFieldNames.country" getEnum={value => `enums.countryCode.${value}`} />
                        <PlainTextField term={{ simpleName: "decimalLatitude", value: location?.location?.coordinates?.lat }} />
                        <PlainTextField term={{ simpleName: "decimalLongitude", value: location?.location?.coordinates?.lon }} />
                      </Properties>
                    </Group>
                    <Group label={"eventDetails.map"}>
                      <Map latitude={location?.location?.coordinates?.lat} longitude={location?.location?.coordinates?.lon} />
                    </Group>
                    <Summary locationID={siteID} year={year} month={month} />
                  </Col>
                </Row>
              </TabPanel>
            )}
      </Col>
    </Row>
  </Tabs>
};

export function TemporalDisplay({ year, month }) {
  if (year && month && month > 0) {

    return (
      <Eyebrow 
        prefix={<><FormattedMessage id="eventDetails.activityDetails.monthYear" values={{ date: new Date(year, month) }}  /></>}
      />
    );
  } else if (year) {
    return (
      <Eyebrow 
        prefix={<FormattedMessage id="eventDetails.activityDetails.year" values={{ date: new Date(year) }} />}
      />
    );
  }
  
  return null;
}


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


