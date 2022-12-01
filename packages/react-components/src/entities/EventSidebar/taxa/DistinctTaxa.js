import React from 'react';
// import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col } from "../../../components";

export function DistinctTaxa({
  data = {},
  loading,
  error,
  setActiveEvent,
  addToSearch,
  addEventTypeToSearch,
  className,
  ...props
}) {
  const { event } = data;
  if (loading || !event) return <h2>Loading event information...</h2>;

  return <Row direction="column" wrap="nowrap">
    <Col style={{ padding: 12, paddingBottom: 50, overflow: 'auto' }} grow>
      <span>hello world</span>
    </Col>
  </Row>
};
