import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const horizontalProperties = () => css`
  display: grid;
  grid-template-columns: minmax(75px, 150px) 1fr;
  > dt {
    margin-bottom: 12px;
  }
`;

export const notHorizontalProperties = () => css`
  > dt {
    margin-bottom: 4px;
  }
`;

export const dl = ({horizontal, ...props}) => css`
    ${horizontal ? horizontalProperties({...props}) : notHorizontalProperties()};
    margin-top: 0;
    margin-bottom: 0;
`;

export const dt = ({horizontal, ...props}) => css`
  color: #767676;
  margin-bottom : ${horizontal ? 20 : 0}px;
  word-break: break-word;
`;

export const dd = ({horizontal, ...props}) => css`
  margin-left: 0;
  margin-bottom: 12px;
  line-height: 16px;
  word-break: break-word;
`;