
import { css, jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { row, col } from './Row.styles';

const GetComponent = rowComponentStyle => React.forwardRef(({
  as: As = 'div',
  className = '',
  style = {},
  wrap,
  direction,
  alignItems,
  justifyContent,
  halfGutter,
  gridGutter,
  shrink,
  grow,
  basis,
  xs,
  sm,
  md,
  lg,
  xl,
  ...props
}, ref) => {
  return <As ref={ref} style={style} className={className} {...props} css={rowComponentStyle({
    wrap,
    direction,
    alignItems,
    justifyContent,
    halfGutter,
    gridGutter,
    shrink,
    grow,
    basis,
    xs,
    sm,
    md,
    lg,
    xl
  })} />
});


export const Row = GetComponent(row);
export const Col = GetComponent(col);