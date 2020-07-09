import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const cssNavBar = ({theme, isActive}) => css`
  background: white;
  border: 1px solid #ddd;
  flex: 0 0 auto;
  margin: 10px;
  border-radius: 4px;
`;

export const cssViewArea = ({theme}) => css`
  flex: 1 1 auto;
  margin: 10px;
  margin-top: 0;
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
  border-radius: 4px 4px 0 0;
    &>div {
      padding: 5px 12px;
      color: white;
      font-size: 0.80em;
      font-weight: 500;
    }
`;

export const cssFilter = ({theme}) => css`
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

export const cssViews = ({theme}) => css`
  margin: 0 10px;
`;

export const tabList = ({theme}) => css``;
