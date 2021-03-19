import { css } from '@emotion/react';
import { tooltip } from '../../style/shared';

export const root = ({ ...props }) => css`
  height: 100%;
`;

export const drawer = ({ ...props }) => css`
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  max-width: 100%;
  transform: translateX(100%);
  overflow: hidden;
  transition: transform 200ms ease-in-out;
  &[data-enter] {
    transform: translateX(0%);
  }
  &:focus {
    outline: none;
  }
`;

export const detailsBackdrop = ({ theme, ...props }) => css`
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  background: ${theme.darkTheme ? '#00000075' : '#00000050'};
  z-index: ${theme.drawerZIndex || 100};
  transition: opacity 50ms ease-in-out;
  opacity: 0;
  &[data-enter] {
    opacity: 1;
  }
`;

export const footerBar = ({ theme }) => css`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
  background: ${theme.paperBackground500};
  border-top: 1px solid ${theme.paperBorderColor};
  padding: 8px 12px;
`;

export const footerItem = props => css`
  border: 1px solid transparent;
  &:hover {
    border-color: #88888844;
  };
  &:active {
    background: #88888888;
  }
  ${tooltip(props)}
`;
