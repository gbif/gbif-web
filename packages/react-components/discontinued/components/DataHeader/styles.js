import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const dataHeader = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`;

export const dataHeaderRight = css`
  flex: 0 0 auto;
  padding: 0 6px;
  align-items: center;
  display: flex;
  > button {
    padding: 7px;
    font-size: 18px;
  }
  > gbif-button-text {
    color: #555;
  }
`;

export default {
  dataHeader,
  dataHeaderRight
}