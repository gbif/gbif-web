import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const tags = ({ ...props }) => css`
  margin: -2px;
  display: inline-block;
  > * {
    margin: 2px;
    display: inline-block
  }
`;

export const tag = ({ type, ...props }) => css`
  /* font-size: 85%;
  border-radius: 4px;
  padding: 3px 6px; */
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #4a4a4a;
  display: inline-flex;
  font-size: .85em;
  /* height: 2em; */
  justify-content: center;
  line-height: 1.5;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
  ${types[type] ? types[type]({ props }) : null}  
`;

const types = {
  error: props => css`
    background-color: #ff6c4b;
    color: #fff;
  `,
  warning: props => css`
    background-color: #ffbf4b;
    color: #5f4515;
  `,
  info: props => css`
    background-color: #3298dc;
    color: #fff;
  `,
  success: props => css`
    background-color: #48c774;
    color: #ffffff;
  `,
  white: props => css`
    background-color: #fff;
    color: rgba(0,0,0,.7);
  `,
  light: props => css`
    background-color: #f5f5f5;
    color: rgba(0,0,0,.7);
  `,
  dark: props => css`
    background-color: #363636;
    color: #fff;
  `
}
