/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { root as rootStyle } from './styles';

export const Root = React.forwardRef(({
  as: Rt = 'div',
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  return <Rt ref={ref} {...props} css={rootStyle({theme})} />
});

Root.displayName = 'Root';

Root.propTypes = {
  as: PropTypes.node
};
