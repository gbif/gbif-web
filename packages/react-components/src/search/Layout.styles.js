import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const cssNavBar = ({theme, isActive}) => css`
  background: ${theme.paperBackground};
  border: 1px solid ${theme.paperBorderColor};
  flex: 0 0 auto;
  margin: 10px;
  border-radius: ${theme.borderRadius}px;
`;

export const cssViewArea = ({theme}) => css`
  flex: 1 1 auto;
  margin: 10px;
  margin-top: 0;
  display: flex;
  flex-direction: column;
`;

export const cssLayout = ({theme}) => css`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;

export const cssFooter = ({theme}) => css`
  flex: 0 0 auto;
  background: #484848;
  position: sticky;
  bottom: 0;
  border-radius: ${theme.borderRadius}px ${theme.borderRadius}px 0 0;
    &>div {
      padding: 5px 12px;
      color: white;
      font-size: 0.80em;
      font-weight: 500;
    }
`;

export const cssFilter = ({theme}) => css`
  padding: 10px;
  border-bottom: 1px solid ${theme.paperBorderColor};
`;

export const cssViews = ({theme}) => css`
  margin: 0 10px;
`;

export const tabList = ({theme}) => css``;
