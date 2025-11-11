
import { css, jsx } from '@emotion/react';
import ThemeContext from '../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { Button, Row, Col, Switch } from '../../../components';

const AdditionalControl = ({ count, onClear, checked, onChange, children, ...props }) => {
  const theme = useContext(ThemeContext);
  return <div {...props} css={summary(theme)}>
    <Row as="div">
      <Col grow></Col>
      <Col grow={false}>
        {children} <Switch checked={checked} onChange={onChange} />
      </Col>
    </Row>
  </div>
}

const summary = theme => css`
  font-size: .85em;
  color: #999;
  font-weight: 400;
  border-bottom: 1px solid ${theme.paperBorderColor};
  > div {
    margin: .5em 1.5em;
  }
`;

export default AdditionalControl;