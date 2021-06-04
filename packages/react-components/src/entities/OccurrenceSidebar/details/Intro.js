
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, Switch, Accordion, Properties } from "../../../components";
import { Header } from './Header';
import { Groups } from './Groups'
import { Summary } from './Summary';
const { Term: T, Value: V } = Properties;

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
  if (loading || !occurrence) return <h1>Loading</h1>;

  return <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
    <Col style={{ padding: '12px 16px', paddingBottom: 50, overflow: 'auto' }} grow>
      <Header data={data} error={error} />
      {/* <Summary occurrence={occurrence} fieldGroups={fieldGroups} loading={loading} setActiveImage={setActiveImage} /> */}

      <Groups data={data} showAll={showAll} setActiveImage={setActiveImage} />

      <Accordion
        css={css.accordion({ theme })}
        summary="Citation"
        defaultOpen={true}
      >
        <Properties style={{ fontSize: 13 }}>
          <T>Please cite as</T>
          <V>{occurrence.dataset.citation.text} https://gbif.org/occurrence/{occurrence.key}</V>
        </Properties>
      </Accordion>
    </Col>
    <Col css={css.controlFooter({ theme })} grow={false}>
      <Row justifyContent="flex-end" halfGutter={8}>
        <Col grow={false}>
          Show all fields <Switch checked={showAll} onChange={() => setShowAll(!showAll)} direction="top" tip="Shortcut s" />
        </Col>
      </Row>
    </Col>
  </Row>
};

/*
{$ occurrence.dataset.citation.text $} {$ _meta.domain $}/occurrence/{$ occurrence.record.key $}
*/