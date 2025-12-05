
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import styles from './styles';

export const Radio = React.forwardRef(({
  as: Span = 'span',
  className = '',
  style = {},
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'radio', {/*modifiers goes here*/}, className);
  return <Span style={style} {...classNames} css={styles.radio({theme})}>
    <input type="radio" ref={ref} {...props} />
    <span></span>
  </Span>
});

Radio.displayName = 'Radio'

Radio.propTypes = {
  as: PropTypes.oneOf(['span', 'div'])
}
