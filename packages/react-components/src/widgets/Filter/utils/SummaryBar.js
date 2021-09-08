
import { css, jsx } from '@emotion/react';
import ThemeContext from '../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Row, Col } from '../../../components';

const SummaryBar = ({ count, onClear, ...props }) => {
  const theme = useContext(ThemeContext);
  return <div {...props} css={summary(theme)} >
    <Row as="div">
      <Col>
          <FormattedMessage id="counts.nSelected" values={{total: count}} />
      </Col>
      {count > 0 &&
        <Col grow={false}>
          <Button appearance="text" onClick={onClear}>Clear</Button>
        </Col>
      }
    </Row>
  </div>
}

const summary = theme => css`
  font-size: .85em;
  color: #999;
  font-weight: 400;
  margin: .5em 1.5em;
`;

export default SummaryBar;