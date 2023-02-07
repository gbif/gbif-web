import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const horizontalProperties = ({dense}) => css`
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
    ${horizontal ? horizontalProperties({ dense, ...props }) : notHorizontalProperties()};
    margin-top: 0;
    margin-bottom: 0;
    > * {
      margin-bottom: ${horizontal && dense ? 4 : 12}px;
    }
    dl dt {
      color: ${theme.color400};
      font-weight: normal;
    }
    > div {
      > dt {
        width: 150px;
      }
      > * {
        display: inline-block;
      }
    }
`;

export const dt = ({ horizontal, theme, ...props }) => css`
  margin-bottom : ${horizontal ? 20 : 0}px;
  word-break: break-word;
  line-height: 1.2em;
  &:last-of-type + * {
    margin-bottom: ${horizontal ? 0 : '.1em'};
  }
`;

export const dd = ({ ...props }) => css`
  margin-left: 0;
  line-height: 1.6em;
  word-break: break-word;
`;

export const propTable = css`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  > div {
    flex: 1 1 auto;
    display: inline-block;
    border: 1px solid #f0f0f0;
    border-radius: 3px;
    display: inline-flex;
    margin: -1px;
    > dt, dd {
      flex: 0 0 auto;
      padding: 4px 8px;
      min-width: 33%;
    }
    >dt {
      background: #fafafa;
      border-right: 1px solid #f0f0f0;
      min-width: 150px;
    }
    >dd {
      background: white;
      flex: 1 1 auto;
      line-break: anywhere;
    }
  }
`;

export const table = css`
  display: table;
  > div {
    display: table-row;
    dt {
      max-width: 180px;
      padding-right: 8px;
      padding-bottom: 8px;
    }
    > * {
      display: table-cell;
    }
  }
`;