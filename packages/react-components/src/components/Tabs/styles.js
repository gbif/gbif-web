import { css } from '@emotion/core';
import camelCase from 'lodash/camelCase';
import { focusStyle } from '../../style/shared';

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

export const tab = ({theme, direction='bottom', isActive}) => css`
  ${border(3, theme.colors.primary500, direction, isActive)}
  display: ${direction === 'left' || direction === 'right' ? 'block' : 'inline-block'};
  padding: 10px 10px;
  cursor: pointer;
  &:hover, &:focus {
    outline: none;
    background: rgba(0,0,0,.05);
  }
  ::-moz-focus-inner {
    border-style: none;
  }
`;

export const tabList = ({theme}) => css`
  padding: 0;
  margin: 0;
  list-style: none;
`;

export default {
  tab,
  tabList
}