
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { root as rootStyle, appRoot as appRootStyle } from './styles';

export const Root = React.forwardRef(({
  as: Rt = 'div',
  appRoot = false,
  style,
  ...props
}, ref) => {
  return <>
    <Rt ref={ref} {...props} style={{ ...style }} css={appRoot ? appRootStyle : rootStyle} />
  </>
});

Root.displayName = 'Root';

Root.propTypes = {
  as: PropTypes.node
};
