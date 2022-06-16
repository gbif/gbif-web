import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import { Row, Col, Switch } from "../../../components";
import { Header } from './Header';
import { Groups} from './Groups';
import {Summary} from "./Summary";

export function Intro({
  data = {},
  loading,
  error,
  setActiveEventID,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const { event } = data;
  if (loading || !event) return <h2>Loading event information...</h2>;

  return <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
    <Col style={{ padding: '12px 0', paddingBottom: 50, overflow: 'auto' }} grow>
      <Header data={data} error={error} />
      <Groups
          event={event}
          showAll={showAll}
          setActiveEventID={setActiveEventID}
      />
      <Summary
          eventID={event.eventID}
          datasetKey={event.datasetKey}
          setActiveEventID={setActiveEventID}
      />
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
