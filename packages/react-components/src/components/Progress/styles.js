import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const progress = ({...props}) => css`
  background: #eee;
  border-radius: 2px;
  height: 4px;
  /* position: relative; */
  > div {
    transition: width 300ms;
    height: 100%;//px;
    border-radius: 2px;
    background: var(--primary);
    max-width: 100%;
    /* position: absolute; */
  }
`;

export default {
  progress
}