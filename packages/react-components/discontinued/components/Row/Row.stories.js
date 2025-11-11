import { text, boolean, number, select } from '@storybook/addon-knobs';
import React from 'react';
import { Row, Col } from './Row';

export default {
  title: 'Components/Layout',
  component: Row,
};

const directionOptions = {
  row: 'row',
  column: 'column'
};

export const ColumnLayout = () => <div style={{ border: '1px solid #888' }}>
  <Row halfGutter={5} gridGutter direction={select('direction', directionOptions, directionOptions.row)} style={{height: 200}}>
    <Col xs={24} sm={24} md={6} lg={8} xl={10} >
      <div style={{ background: 'deepskyblue', height: '100%' }}>&nbsp;</div>
    </Col>
    <Col xs={24} sm={12} md={12} lg={8} xl={4} >
      <div style={{ background: 'deepskyblue', height: '100%' }}>&nbsp;</div>
    </Col>
    <Col xs={24} sm={12} md={6} lg={8} xl={10} >
      <div style={{ background: 'deepskyblue', height: '100%' }}>&nbsp;</div>
    </Col>
  </Row>
</div>

ColumnLayout.story = {
  name: 'Flex layout',
};


const wrapOptions = {
  wrap: 'wrap',
  'no-wrap': 'no-wrap',
  'wrap-reverse': 'wrap-reverse'
};

export const ControlledLayout = () => <div style={{ border: '1px solid #888' }}>
  <Row halfGutter={5} gridGutter wrap={select('wrap', wrapOptions, wrapOptions.wrap)}>
    <Col grow={boolean("Col1 grow", true)} basis={number("Col1 Basis", 50)} shrink={boolean("Col1 shrink", true)}>
      <div style={{ background: 'deepskyblue' }}>{text('Col1 text', 'Column 1 text')}</div>
    </Col>
    <Col basis={50} grow={true} shrink={true}>
      <div style={{ background: 'deepskyblue' }}>{text('Col2 text', 'Has basis=50; grow=true; shrink=true')}</div>
    </Col>
  </Row>
</div>

ControlledLayout.story = {
  name: 'Controlled layout',
};
