
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import styles from './styles';

export function Progress({
  className,
  percent,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'progress', {/*modifiers goes here*/ }, className);
  return <div css={styles.progress({ theme })} {...props}>
    <div style={{ width: `${percent}%` }}></div>
  </div>
};

Progress.propTypes = {
  as: PropTypes.element
};
