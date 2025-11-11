import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const horizontalProperties = () => css`
  display: grid;
  grid-template-columns: minmax(75px, 200px) 1fr;
  > dt {
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  dt {
    padding-right: 8px;
  }
`;

export const notHorizontalProperties = () => css`
  > dt {
    margin-bottom: .1em;
    margin-top: 1.5em;
    &:first-of-type {
      margin-top: 0;
    }
  }
  dt {
    font-weight: bold;
  }
  
`;

export const dl = ({ horizontal, dense, theme, ...props }) => css`
    ${horizontal ? horizontalProperties({ ...props }) : notHorizontalProperties()};
    margin-top: 0;
    margin-bottom: 0;
    > * {
      margin-bottom: ${horizontal && dense ? 4 : 12}px;
    }
    dl dt {
      color: ${theme.color400};
      font-weight: normal;
    }
`;

export const dt = ({ horizontal, theme, ...props }) => css`
  margin-bottom : ${horizontal ? '1.5em' : '1em'};
  word-break: break-word;
  line-height: 1.3em;
  &:last-of-type {
    margin-bottom: ${horizontal ? 0 : '.1em'};
  }
`;

export const dd = ({ ...props }) => css`
  margin-left: 0;
  line-height: 1.6em;
  word-break: break-word;
  &:last-of-type {
    margin-bottom: 0;
  }
`;