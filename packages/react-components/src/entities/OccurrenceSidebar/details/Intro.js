
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import { Row, Col, Switch } from "../../../components";
import { Header } from './Header';
import { Groups } from './Groups';

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

  const { occurrence } = data;
  if (loading || !occurrence) return <h2>Loading</h2>;//TODO replace with proper skeleton loader

  return <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
    <Col style={{ padding: '12px 0', paddingBottom: 50, overflow: 'auto' }} grow>
      <Header data={data} error={error} />
      <Groups occurrence={occurrence} showAll={showAll} setActiveImage={setActiveImage} />
    </Col>
    <Col css={css.controlFooter({ theme })} grow={false}>
      <Row justifyContent="flex-end" halfGutter={8}>
        <Col grow={false}>
          <FormattedMessage id={`occurrenceDetails.showAllFields`}/> <Switch checked={showAll} onChange={() => setShowAll(!showAll)} direction="top" tip="Shortcut s" />
        </Col>
      </Row>
    </Col>
  </Row>
};

/*
{$ occurrence.dataset.citation.text $} {$ _meta.domain $}/occurrence/{$ occurrence.record.key $}
*/