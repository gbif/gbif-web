/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { dl, dt, dd } from './styles';

export function Properties({as:Dl='dl', horizontal, ...props}) {
  const theme = useContext(ThemeContext);
  return <Dl css={dl({ theme, horizontal })} {...props} />
}
Properties.propTypes = {
  as: PropTypes.any,
  horizontal: PropTypes.bool
};

export function Term({as:Dt='dt', ...props}) {
  const theme = useContext(ThemeContext);
  return <Dt css={dt({ theme, props })} {...props} />
}
Term.propTypes = {
  as: PropTypes.any
};

export function Value({as:Dd='dd', ...props}) {
  const theme = useContext(ThemeContext);
  return <Dd css={dd({ theme })} {...props} />
}
Value.propTypes = {
  as: PropTypes.any
};

Properties.Term = Term;
Properties.Value = Value;

