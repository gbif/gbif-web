
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import * as css from './styles';

export const Skeleton = ({
  as: Span = 'span',
  width = '100%',
  ...props
}) => {
  const theme = useContext(ThemeContext);
  let w;
  if (width === 'random') {
    w = `${Math.floor(Math.random()*50+50)}%`;
  } else if (typeof w === 'number') {
    w = `${Math.floor(Math.random()*50+50)}px`;
  } else {
    w = width;
  }
  return <Span css={css.skeleton({theme, width: w, inlineElement: ['span'].includes(Span)})} {...props}>&nbsp;</Span>
};

Skeleton.displayName = 'Skeleton';

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  as: PropTypes.oneOf(['span', 'div', 'h1', 'p', 'h2']),
};
