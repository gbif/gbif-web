
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import * as styles from './Select.styles';

export const Select = React.forwardRef(({
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  return <select ref={ref} {...props} css={styles.select} />
});

Select.displayName = 'Select'