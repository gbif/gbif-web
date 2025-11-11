
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses, formatAsPercentage } from '../../utils/util';
import * as styles from './styles';

const palette = ['orange', 'deepskyblue', 'tomato'];

export const Progress = React.forwardRef(({
  className,
  percent,
  color,
  unknown,
  overlays,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'progress', {/*modifiers goes here*/ }, className);

  let more = [];
  if (Array.isArray(overlays)) {
    overlays.forEach((x, i) => {
      if (typeof x === 'number') {
        more.push({ percent: x, color: palette[i] || 'tomato' })
      } if (typeof x?.percent === 'number' && typeof x?.color === 'string') {
        more.push({ percent: x.percent, color: x.color })
      }
    });
  }
  more = more.sort((a,b) => a.percent < b.percent);
  return <div css={styles.progress({ color, theme, unknown })} {...props} role="progressbar" ref={ref}>
    <div style={{ width: `${percent}%` }}></div>
    {more.length > 0 && more.map((x, i) => <div key={i} style={{ width: `${x.percent}%`, background: x.color }}></div>)}
  </div>
});

Progress.propTypes = {
  as: PropTypes.element
};

export function ProgressItem({ fraction, subtleText, title, color, hidePercentage, ...props }) {
  return <div {...props}>
    <div css={styles.progressItem({subtleText})}>
      <div>{title}</div>
      {!hidePercentage && <span>{formatAsPercentage(fraction)}%</span>}
    </div>
    <Progress percent={100 * fraction} size="small" color={color} />
  </div>
}