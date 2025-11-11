import { css, keyframes } from '@emotion/react';
import { helper } from '../../utils/helper';

export const button = css`
  ${helper.noUserSelect}
  appearance: none;
  text-decoration: none;
  
  /* max-width: 100%; */
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  
  text-align: center;

  border: 1px solid transparent;
  border-radius: var(--borderRadiusPx);
  box-shadow: none;

  font-size: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  line-height: calc(1.5em - 6px);
  position: relative;
  margin: 0;
  background-color: white;
  color: var(--color);
  cursor: pointer;
  justify-content: center;
  padding-left: 0.5em;
  padding-right: 0.5em;
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

export const text = css`
  padding: 0;
  border: none;
  height: auto;
  color: inherit;
  line-height: inherit;
  font-weight: inherit;
  background: none;
  border-radius: 0;
  cursor: pointer;
`;

export const textHoverLinkColor = css`
  color: inherit;
  cursor: pointer;
  height: auto;
  line-height: inherit;
  &:hover {
    color: var(--primary500);
  }
`;

export const textHover = css`
  padding: 0;
  border: none;
  height: auto;
  color: inherit;
  line-height: inherit;
  font-weight: inherit;
  background: none;
  border-radius: 0;
  cursor: pointer;

  border: 1px solid transparent;
  border-radius: var(--borderRadiusPx);
  box-shadow: none;
  margin: 0 -4px;
  padding: 1px 4px;
  &:hover {
    background-color: var(--primary500);
    border-color: var(--primary600);
    color: white;
    * {
      color: white;
    }
  }
`;

export const primary = css`
  background-color: var(--primary500);
  border-color: var(--primary600);
  color: white!important;
  &:not([aria-disabled="true"]) {
    &:hover {
      color: white;
      border-color: var(--primary500);
      background-color: var(--primary600);
    }
    &:active,
    &[aria-expanded="true"] {
      color: white;
      border-color: var(--primary600);
      background-color: var(--primary700);
    }
  }
`;

export const primaryOutline = css`
  border-color: var(--primary600);
  background: none;
  color: var(--primary700)!important;
`;

export const outline = css`
  border-color: var(--transparentInk40);
  background: none;
`;

export const ghost = css`
  border-color: #808080;
  color: #808080;
  background: none;
`;

export const danger = css`
  background: tomato;
  color: white;
`;

export const link = css`
  ${text};
  color: var(--primary500);
`;

export const isFullWidth = css`
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

export const loading = css`
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

export const group = css`
  display: inline-flex;
  /* width: fit-content; */
  max-width: 100%;
  > button, > label {
    overflow: hidden;
    border-radius: 0;
    margin: 0;
    margin-right: -1px;
    :first-of-type {
      border-top-left-radius: var(--borderRadiusPx);
      border-bottom-left-radius: var(--borderRadiusPx);
      flex: 1 1 auto;
    }
    :last-of-type {
      border-top-right-radius: var(--borderRadiusPx);
      border-bottom-right-radius: var(--borderRadiusPx);
    }
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
  isFullWidth,
  text,
  group
};