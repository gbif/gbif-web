import { css, keyframes } from '@emotion/react';

export const placeholder = props => css`
  &::placeholder {
    color: ${props.theme.color500};
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

export const transparentInputOverlay = css`
  margin: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
`;

export const styledScrollBars = ({ theme }) => css`
  scrollbar-width: thin;
  &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.darkTheme ? '#ffffff38' : '#686868'};
  }
`;

export const classification = ({ ...props }) => css`
  line-height: 1.2em;
  &>span:after {
    font-style: normal;
    content: ' ❯ ';
    font-size: 80%;
    color: #ccc;
    display: inline-block;
    padding: 0 3px;
  }
  &>span:last-of-type:after {
    display: none;
  }
  .gbif-classification-unknown {
    opacity: 0.5;
  }
`;

export const root = ({ appRoot, theme = {} }) => css`
  * {
    font-family: ${theme.fontFamily || 'BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif'};
  }
  color: ${theme.color900 || '#4a4a4a'};
  font-size: ${theme.fontSize || '1em'};
  font-weight: 400;
  line-height: 1.2em;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  background: ${appRoot ? theme.background : null};
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
      background-color: ${props.theme.darkPaperBackground};
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
    background-color: #88888830;
  }
  50% {
    background-color: #88888830;
  }
  75% {
    background-color: #afafaf30;
  }
  to {
    background-color: #88888830;
  }
`;

export const bulletList = css`
  margin: 0;
  padding: 0;
  list-style: none;
  &>li {
    display: inline-block;
    &:after {
      font-style: normal;
      content: '●';
      font-size: 80%;
      padding: 0 3px;
    }
    :last-of-type:after {
      display: none;
    }
  }
`;

export const discreetLink = css`
  text-decoration: none;
  color: inherit!important;
  &:hover {
    text-decoration: underline;
    color: inherit!important;
  }
`;