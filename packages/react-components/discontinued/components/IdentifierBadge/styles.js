import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const identifierBadge = css`
  display: inline-block;
  font-size: 0.85em;
  &:hover {
    text-decoration: none;
    >span:first-of-type, >div:first-of-type {
      background-color: var(--primary700);
    }
  }
  > * {
    padding: 0 5px;
    display: inline-block;
    border: 1px solid #dbe3e7;
  }
  >span:first-of-type, >div:first-of-type {
    transition: all .3s ease;
    background-color: var(--primary500);;
    border-color: var(--primary600);;
    padding: 0 4px;
    border-radius: var(--borderRadiusPx) 0 0 var(--borderRadiusPx);
    color: #fff;
    border-right-width: 0;
  }
  > *:last-child {
    padding: 0 7px;
    border-radius: 0 var(--borderRadiusPx) var(--borderRadiusPx) 0;
    border-left-width: 0;
    color: var(--color);
    text-decoration: none;
  }
`;