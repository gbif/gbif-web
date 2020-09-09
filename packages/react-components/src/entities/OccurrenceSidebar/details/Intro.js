/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, Switch } from "../../../components";
import { Header } from './Header';
import { Groups } from './Groups'
import { Summary } from './Summary_deprecated';

export function Intro({
  data = {},
  isSpecimen,
  loading,
  fieldGroups,
  setActiveImage,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const [verbatim, setVerbatim] = useState(false);

  const { occurrence } = data;
  if (loading || !occurrence) return <h1>Loading</h1>;

  return <Row direction="column">
    <Col style={{ padding: '12px 16px', paddingBottom: 50 }} grow>
      <Header data={data} error={error} />
      <Groups data={data} showAll={showAll} verbatim={verbatim} />
    </Col>
    <Col css={css.controlFooter({ theme })} grow={false}>
      <Row justifyContent="flex-end" halfGutter={8}>
        <Col grow={false}>
          Show all fields <Switch disabled={verbatim} checked={showAll} onChange={() => setShowAll(!showAll)} direction="top" tip="Shortcut s" />
        </Col>
        <Col grow={false} shrink>
          Diagnostics view <Switch checked={verbatim} onChange={() => setVerbatim(!verbatim)} direction="top" tip="Shortcut v" />
        </Col>
      </Row>
    </Col>
  </Row>
};
