/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ThemeContext from '../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Checkbox } from '../../../components';

export const Option = React.forwardRef(({ label, tabIndex, checked, onChange, helpText, helpVisible, ...props }, ref) => {
  const theme = {};//useContext(ThemeContext);
  return <label css={optionClass(theme)} style={{ display: 'flex', wrap: 'nowrap' }}>
    <div>
      <Checkbox ref={ref} tabIndex={tabIndex} checked={checked} onChange={onChange} style={{ flex: '0 0 auto' }} />
    </div>
    <div style={{ flex: '1 1 auto', marginLeft: 10, wordBreak: 'break-word' }}>
      <div>{label}</div>
      {helpVisible && helpText && <div style={{ marginTop: 4, fontSize: '0.85em', color: '#aaa' }}>
        {helpText}
      </div>}
    </div>
  </label>

  // return <Row as="label" {...props} css={optionClass(theme)} halfGutter={4} wrap="nowrap">
  //   <Col grow={false} shrink={false}>
  //     <Checkbox ref={ref} checked={checked} onChange={onChange} />
  //   </Col>
  //   <Col>
  //     <div>{label}</div>
  //     {helpVisible && helpText && <div style={{ marginTop: 4, fontSize: '0.85em', color: '#aaa' }}>
  //       {helpText}
  //     </div>}
  //   </Col>
  // </Row>
});

Option.propTypes = {
  label: PropTypes.node,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  helpText: PropTypes.node,
  helpVisible: PropTypes.bool,
  rover: PropTypes.object,
};

Option.displayName = 'FilterOption';

const optionClass = theme => css`
  padding: 6px 0;
  &:last-child {
    margin-bottom: 0;
  }
`;


