/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ThemeContext from './style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

const Root = ({
  as: Rt,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  return <Rt css={css`
          font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
          color: ${theme.color || '#4a4a4a'};
          font-size: ${theme.fontSize || '1em'};
          font-weight: 400;
          box-sizing: border-box;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          /* background: ${theme.background || 'white'}; */
          *, *::before, *::after, strong {
            box-sizing: inherit;
          }
      `} {...props}>
  </Rt>
}

Root.displayName = 'Root'

Root.defaultProps = {
  as: 'div'
}

Root.propTypes = {
  as: PropTypes.node
}

export default Root;