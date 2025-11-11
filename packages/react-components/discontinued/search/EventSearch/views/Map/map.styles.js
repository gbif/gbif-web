import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const mapArea = ({ theme }) => css`
  flex: 1 1 100%;
  display: flex;
  height: 100%;
  max-height: 100vh;
  flex-direction: column;
  position: relative;
`;

export const mapComponent = ({ theme }) => css`
  flex: 1 1 100%;
  border: 1px solid ${theme.paperBorderColor};
  border-radius: ${theme.borderRadius}px;
  display: flex;
  flex-direction: column;
  height: 100%;
  canvas:focus {
    outline: none;
  }
`;

export const resultList = ({ }) => css`
  z-index: 10;
  margin: 12px;
  position: absolute;
  left: 0;
  top: 0;
  width: 350px;
  max-width: 100%;
  height: auto;
  max-height: calc(100% - 24px);
  display: flex;
  flex-direction: column;
`;
