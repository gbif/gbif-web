import { css } from '@emotion/core';
import { tooltip } from '../../style/shared';

export const root = ({...props}) => css`
  height: 100%;
`;

export const drawer = ({...props}) => css`
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  transform: translateX(100%);
  overflow: hidden;
  transition: transform 200ms ease-in-out;
  &[data-enter] {
    transform: translateX(0%);
  }
`;

export const detailsBackdrop = ({...props}) => css`
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  background: #00000050;
  z-index: 10;
  transition: opacity 50ms ease-in-out;
  opacity: 0;
  &[data-enter] {
    opacity: 1;
  }
`;

export const footerItem = props => css`
  border: 1px solid transparent;
  &:hover {
    border-color: #eaeaea;
  };
  &:active {
    background: #f0f2f3;
  }
  ${tooltip(props)}
`;
