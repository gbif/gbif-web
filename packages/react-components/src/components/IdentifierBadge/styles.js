import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const identifierBadge = ({...props}) => css`
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #00000033;
  > * {
    padding: 0 5px;
  }
  >span:first-child {
    background: #439eff;
    color: white;
  }
`;