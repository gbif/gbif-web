import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const horizontalProperties = () => css`
  display: grid;
  grid-template-columns: minmax(75px, 150px) 1fr;
  > dt {
    margin-bottom: 12px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

export const notHorizontalProperties = () => css`
  > dt {
    margin-bottom: 4px;
  }
`;

export const dl = ({ horizontal, dense, ...props }) => css`
    ${horizontal ? horizontalProperties({ ...props }) : notHorizontalProperties()};
    margin-top: 0;
    margin-bottom: 0;
    > dd {
      margin-bottom: ${horizontal && dense ? 4 : 12}px;
    }
`;

export const dt = ({ horizontal, theme, ...props }) => css`
  color: ${theme.color400};
  margin-bottom : ${horizontal ? 20 : 0}px;
  word-break: break-word;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const dd = ({ ...props }) => css`
  margin-left: 0;
  line-height: 16px;
  word-break: break-word;
  &:last-of-type {
    margin-bottom: 0;
  }
`;