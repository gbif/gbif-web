
import { css, jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { checkbox } from './styles';

export const Checkbox = React.forwardRef(({
  as: Span = 'span',
  className = '',
  style = {},
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  return <Span style={style} className={className} css={checkbox({theme})}>
    <input type="checkbox" ref={ref} {...props} />
    <span></span>
  </Span>
});

Checkbox.displayName = 'Checkbox'

Checkbox.propTypes = {
  as: PropTypes.oneOf(['span', 'div'])
}