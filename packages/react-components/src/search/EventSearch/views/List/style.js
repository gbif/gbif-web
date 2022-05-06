import { css } from '@emotion/react';
// import { focusStyle, noUserSelect } from '../../style/shared';

export const datasetList = ({theme, ...props}) => css`
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    margin-bottom: 12px;
    max-width: 100%;
    width: 1000px;
  }
`;

export const datasetSkeleton = ({theme, ...props}) => css`
  padding: 24px;
  background: white;
  border: 1px solid #eee;
  width: 1000px;
  margin-bottom: 12px;
  h2 {
    color: none;
    line-height: 1;
    width: 300px;
    background: #888;
  }
  p {
    width: 200px;
    background: #888;
  }
`;

export const details = ({theme, ...props}) => css`
  > div {
    margin-bottom: 0.4em;
    >span {
      font-weight: 500;
    }
  }
`;

export const summary = ({theme, ...props}) => css`
  padding: 24px;
  background: white;
  border: 1px solid #eee;
  h2 {
    margin-top: 0;
    font-size: 1.2rem;
  }
`;

export const events = ({theme, ...props}) => css`
  background: #f8f8f8;
  padding: 12px 24px;
  margin: 0 4px 0 4px;
  border: 1px solid #eee;
  border-top-width: 0;
  border-radius: 0 0 4px 4px;
  /* max-height: 150px;
  overflow: auto; */
`;

export const tabularListItem = ({theme, ...props}) => css`
  display: flex;
  padding: 6px 24px;
  color: #888;
  > div {
    width: 25%;
    line-break: anywhere;
    margin-right: 8px;
  }
`;

export const eventList = ({theme, ...props}) => css`
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    margin-bottom: 8px;
    > div {
      ${tabularListItem({})}
      color: #333;
      background: white;
      border: 1px solid #eee;
      padding: 12px 24px;
    }
  }
`;