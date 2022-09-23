
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import styles from './styles';

const palette = ['orange', 'deepskyblue', 'tomato'];

export function Progress({
  className,
  percent,
  // overlays,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'progress', {/*modifiers goes here*/ }, className);

  // let more = [];
  // if (Array.isArray(overlays)) {
  //   overlays.forEach((x, i) => {
  //     if (typeof x === 'number') {
  //       more.push({ percent: x, color: palette[i] || 'tomato' })
  //     } if (typeof x?.percent === 'number' && typeof x?.color === 'string') {
  //       more.push({ percent: x, color: x.color })
  //     }
  //   });
  // }
  // more = more.sort((a,b) => a.percent < b.percent);
  return <div css={styles.progress({ theme })} {...props}>
    <div style={{ width: `${percent}%` }}></div>
    {/* {more.length > 0 && more.map((x, i) => <div style={{ width: `${x.percent}%`, background: x.color }}></div>)} */}
  </div>
};

Progress.propTypes = {
  as: PropTypes.element
};
