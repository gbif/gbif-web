import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import {Row, Col, Switch, Button} from "../../../components";
import {Group, Groups} from './Groups';
import {Summary} from "./Summary";
import Map from "../../SiteSidebar/details/Map/Map";
import {MdOutlineWarningAmber} from "react-icons/md";

export function Intro({
  data = {},
  loading,
  error,
  setActiveEvent,
  addToSearch,
  addEventTypeToSearch,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const { event } = data;
  if (loading || !event) return <h2>Loading event information...</h2>;

  const hasCoordinates = (event?.decimalLatitude != null && event?.decimalLongitude != null ) || event?.wktConvexHull != null;

  return <Row direction="column" wrap="nowrap">
    <Col style={{ padding: '12px 0', paddingBottom: 50, overflow: 'auto' }} grow>
      <Groups
          event={event}
          showAll={showAll}
          setActiveEvent={setActiveEvent}
          addToSearch={addToSearch}
          addEventTypeToSearch={addEventTypeToSearch}
      />

      { hasCoordinates  &&
      <Group label="eventDetails.map">
        <Map
            latitude={event.decimalLatitude}
            longitude={event.decimalLongitude}
            wkt={event.wktConvexHull}
        />
      </Group>
      }
      <Summary event={event} setActiveEvent={setActiveEvent} addEventTypeToSearch={addEventTypeToSearch} />
    </Col>
    <Col css={css.controlFooter({ theme })} grow={false}>
      <Row justifyContent="flex-end" halfGutter={8}>
        <Col grow={false}>
          <FormattedMessage id={`eventDetails.showAllFields`}/>
          <Switch checked={showAll} onChange={() => setShowAll(!showAll)} direction="top" tip="Shortcut s" />
        </Col>
      </Row>
    </Col>
  </Row>
};
