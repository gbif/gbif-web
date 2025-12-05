import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const routerOption = ({ theme, isActive }) => css`
  border-left: 3px solid ${isActive ? theme.primary500 : 'transparent'};
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 12px 12px;
  white-space: nowrap;
  ::-moz-focus-inner {
    border-style: none;
  }
  &:hover, &:focus {
    outline: none;
    background: rgba(0,0,0,.05);
  }
  &:focus, :focus-within {
    outline: none;
    background: ${theme.darkTheme ? '#00000050' : '#00000010'};
  }
`;

export const routerTab = ({ theme, isActive }) => css`
  border-bottom: 3px solid ${isActive ? theme.primary500 : 'transparent'};
  flex: 0 1 auto;
  white-space: nowrap;
  &:hover, &:focus {
    outline: none;
    background: rgba(0,0,0,.05);
  }
  a, span {
    cursor: pointer;
    padding: 10px 10px;
    display: inline-block;
    color: inherit;
    text-decoration: none;
    ::-moz-focus-inner {
      border-style: none;
    }
  }
`;

export const visible = css`
  order: 0;
  visibility: visible;
  opacity: 1;
`;
export const invisible = css`
  order: 100;
  visibility: hidden;
  pointer-events: none;
`;
export const toolbarWrapper = css`
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
`;
export const overflowStyle = css`
  order: 99;
  display: flex;
  align-items: center;
`;