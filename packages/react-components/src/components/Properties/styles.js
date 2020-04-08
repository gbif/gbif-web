import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const horizontalProperties = () => css`
  display: grid;
  grid-template-columns: minmax(75px, 150px) 1fr;
  > dt {
    margin-bottom: 20px;
  }
`;

export const notHorizontalProperties = () => css`
  > dt {
    margin-bottom: 4px;
  }
`;

export const dl = ({horizontal, ...props}) => css`
    ${horizontal ? horizontalProperties({...props}) : notHorizontalProperties()}
`;

export const dt = ({horizontal, ...props}) => css`
  color: #767676;
  margin-bottom : ${horizontal ? 20 : 0}px;
`;

export const dd = ({horizontal, ...props}) => css`
  margin-left: 0;
  margin-bottom: 20px;
  line-height: 16px;
`;