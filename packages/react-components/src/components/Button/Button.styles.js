import { css, keyframes } from '@emotion/core';
import { helper } from '../../utils/helper';

export const button = theme => css`
  ${helper.noUserSelect}
  appearance: none;
  
  /* max-width: 100%; */
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  
  text-align: center;

  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: none;

  font-size: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  line-height: calc(1.5em - 6px);
  position: relative;
  margin: 0;
  background-color: white;
  color: ${theme.color};
  cursor: pointer;
  justify-content: center;
  padding-left: ${theme.dense ? 0.5 : 1}em;
  padding-right: ${theme.dense ? 0.5 : 1}em;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  }
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: auto;
  }
  ::-moz-focus-inner {
    border-style: none;
  }
`;

export const text = theme => css`
  padding: 0;
  border: none;
  height: auto;
  color: inherit;
  line-height: inherit;
  font-weight: inherit;
  background: none;
  border-radius: 0;
`;

export const primary = theme => css`
  background-color: ${theme.colors.primary500};
  border-color: ${theme.colors.primary600};
  color: white;
  &:not([aria-disabled="true"]) {
    &:hover {
      color: white;
      border-color: ${theme.colors.primary500};
      background-color: ${theme.colors.primary600};
    }
    &:active,
    &[aria-expanded="true"] {
      color: white;
      border-color: ${theme.colors.primary600};
      background-color: ${theme.colors.primary700};
    }
  }
`;

export const primaryOutline = (theme) => css`
  border-color: ${theme.colors.primary600};
  background: none;
  color: ${theme.colors.primary700};
`;

export const outline = (theme) => css`
  border-color: ${theme.transparentInk40};
  background: none;
`;

export const ghost = (theme) => css`
  border-color: #808080;
  color: #808080;
  background: none;
`;

export const danger = (theme) => css`
  background: tomato;
  color: white;
`;

export const link = (theme) => css`
  border-color: transparent;
  background: none;
`;

export const block = (theme) => css`
  display: flex; 
  width: 100%;
`;

export const spinAround = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;

export const loading = (theme) => css`
  &:after {
    animation: ${spinAround} 500ms infinite linear;
    border: 2px solid #dbdbdb;
    border-radius: 0.5em;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    display: block;
    height: 1em;
    width: 1em;
    left: calc(50% - (1em / 2));
    top: calc(50% - (1em / 2));
    position: absolute !important;
  }
  color: transparent !important;
  pointer-events: none;
`;

export const group = (theme) => css`
  display: inline-flex;
  /* width: fit-content; */
  max-width: 100%;
  > button {
    overflow: hidden;
    border-radius: 0;
    margin: 0;
    margin-right: -1px;
  }
  >button:first-of-type {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    flex: 1 1 auto;
  }
  >button:last-of-type {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export default {
  button,
  primary,
  primaryOutline,
  outline,
  ghost,
  danger,
  link,
  loading,
  block,
  text,
  group
};