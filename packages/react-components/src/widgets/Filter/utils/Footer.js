/** @jsxImportSource @emotion/core */
import { css, jsx } from '@emotion/core';
import ThemeContext from '../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '../../../components';
import { Button } from '../../../components/Button';

const Footer = ({ onApply, onCancel, onBack, showBack = false, formId, ...props }) => {
  const theme = useContext(ThemeContext);
  return <Row {...props} css={footer(theme)}>
    <Col>
      {showBack && <Button appearance="ghost" onClick={onBack}>Back</Button>}
      {!showBack && <Button appearance="ghost" onClick={onCancel}>Cancel</Button>}
    </Col>
    <Col grow={false}>
      {!showBack && <Button type="submit" form={formId} onClick={onApply}>Apply</Button>}
    </Col>
  </Row>
}

Footer.propTypes = {
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onBack: PropTypes.func,
  showBack: PropTypes.bool,
  formId: PropTypes.string
};

const footer = theme => css`
  padding: .8em 1em;
  flex: 0 0 auto;
`;

export default Footer;