
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import styles from './Input.styles';

export const Input = React.forwardRef(({
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  return <input ref={ref} {...props} css={styles.input({theme})} />
});

Input.displayName = 'Input'
