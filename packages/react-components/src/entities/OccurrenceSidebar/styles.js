import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const sideBar = ({...props}) => css`
  background: white;
`;

export const detailDrawerBar = props => css`
  border: 1px solid #e8e8e8;
  border-width: 0 1px;
`;

export const detailDrawerContent = props => css`
  overflow: auto;
  flex: 1 1 auto;
  >div {
    /* width: 500px; */
    max-width: 100%;
  }
`;

export const accordion = props => css`
  font-size: 14px;
  margin: 20px 0;
`;

export const imageContainer = props => css`
  background: #fafafa;
  border: 1px solid #eee;
  >img {
    display: block;
    margin: auto;
  }
`;