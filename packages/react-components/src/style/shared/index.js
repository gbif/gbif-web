import { css, keyframes } from '@emotion/core';

export const placeholder = props => css`
  &::placeholder {
    color: #bbb;
  }
`;

export const noUserSelect = props => css`
  -webkit-touch-callout: none;
  user-select: none;
`;

export const focusStyle = props => css`
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  }
  ::-moz-focus-inner {
    border-style: none;
  }
`;

export const styledScrollBars = props => css`
  scrollbar-width: thin;
  &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #686868;
  }
`;

export const root = ({theme = {}}) => css`
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

export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
`;

export const tooltip = props => css`
  &:hover {
    position: relative;
    &[tip]:before {
      border-radius: 2px;
      background-color: #585858;
      color: #fff;
      content: attr(tip);
      font-size: 12px;
      padding: 5px 7px;
      position: absolute;
      white-space: nowrap;
      z-index: 25;
      line-height: 1.2em;
      pointer-events: none;
    }
    &[direction="right"]:before {
      top: 50%;
      left: 120%;
      transform: translateY(-50%);
    }
    &[direction="left"]:before {
      top: 50%;
      right: 120%;
      transform: translateY(-50%);
    }
    &[direction="top"]:before {
      right: 50%;
      bottom: 120%;
      transform: translateX(50%);
    }
    &[direction="bottom"]:before {
      right: 50%;
      top: 120%;
      transform: translateX(50%);
    }
  }
`;

export const skeletonLoading = keyframes`
  from {
    background-color: #eee;
  }
  50% {
    background-color: #eee;
  }
  75% {
    background-color: #dfdfdf;
  }
  to {
    background-color: #eee;
  }
`;