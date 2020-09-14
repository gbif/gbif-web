import { css } from '@emotion/core';
import camelCase from 'lodash/camelCase';
// import { focusStyle } from '../../style/shared';

const opposite = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top'
}
const border = (width, color, dir, isActive) => ({
  border: '0 solid transparent',
  [camelCase(`border-${dir}`)]: `${width}px solid ${isActive ? color : 'transparent'}`,
  [camelCase(`border-${opposite[dir]}`)]: `${width}px solid transparent`,
});

export const tab = ({ theme, direction = 'bottom', isActive }) => css`
  ${border(3, theme.primary500, direction, isActive)}
  padding: 10px 10px;
  flex: 0 1 auto;
  cursor: pointer;
  &:hover, &:focus {
    outline: none;
    background: rgba(0,0,0,.05);
  }
  ::-moz-focus-inner {
    border-style: none;
  }
`;

export const tabList = ({ theme, vertical }) => css`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: ${vertical ? 'column' : 'row'};
  flex-wrap: nowrap;
`;

export const tabSeperator = ({ theme, vertical }) => css`
  margin: 0 10px;
  width: 1px;
  padding: 5px 0;
  flex: 0 1 auto;
  border-left: 1px solid #ddd;
`;

export const tabSpacer = ({ theme, vertical }) => css`
  flex: 1 1 auto;
`;

export default {
  tab,
  tabList,
  tabSeperator,
  tabSpacer
}