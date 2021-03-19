import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const progress = ({...props}) => css`
  background: #eee;
  border-radius: 2px;
  height: 4px;
  > div {
    transition: width 300ms;
    height: 4px;
    border-radius: 2px;
    background: #68daa8;
    max-width: 100%;
  }
`;

export default {
  progress
}