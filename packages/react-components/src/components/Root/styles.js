import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const root = ({theme}) => css`
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
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
`;

export default {
  root
}