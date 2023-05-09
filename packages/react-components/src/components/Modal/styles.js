import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const backdrop = theme => css`
  background-color: ${theme.darkTheme ? '#0000006b' : '#00000040'};
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: ${(theme.drawerZIndex || 1000)-2};
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;
export const modal = theme => css`
  background-color: ${theme.paperBackground500};
  box-sizing: border-box;
  z-index: ${(theme.modalZIndex || 1000)-1};
  border-radius: ${theme.borderRadius}px;
  outline: 0px;
  border: 1px solid ${theme.paperBorderColor};
  /* border: 1px solid rgba(33,33,33,0.25); */

  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  max-height: calc(100vh - 56px);
  max-width: 100%;
  overflow: auto;
`;

export const dialog = css`
  padding: 20px 24px;
`;

export const dialogTitle = css`
  display: flex;
  align-items: center;
  word-wrap: break-word;
  margin-bottom: 8px;
  > div:first-of-type {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    flex: 1 1 auto;
  }
`;