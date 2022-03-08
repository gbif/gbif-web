
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import useBelow from '../../utils/useBelow';
import { dl, dt, dd } from './styles';

export function Properties({as:Dl='dl', breakpoint, horizontal, dense = false, ...props}) {
  const isBelow = useBelow(breakpoint);
  const theme = useContext(ThemeContext);
  return <Dl css={dl({ theme, horizontal: typeof horizontal !== 'undefined' ? horizontal : !isBelow, dense })} {...props} />
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