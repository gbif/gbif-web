import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const paper = ({ theme }) => css`
  background: ${theme.paperBackground500};
  border: 1px solid ${theme.paperBorderColor};
  border-radius: ${theme.borderRadius}px;
  padding: 4px;
`;

export const more = ({ theme }) => css`
  height: 100%;
  min-height: 150px;
  min-width: 100px;
`;

export const features = ({ theme }) => css`
  font-size: 11px;
  color: ${theme.color500}
`;