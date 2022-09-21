import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';


export const headerWrapper = ({ ...props }) => css`
  background: white;
  padding: 1rem 1rem 0 1rem;
  h1 {
    margin-top: 0;
    margin-bottom: .25em;
    font-size: 2.5rem;
    font-weight: 700;
  }
  a {
    color: #1393D8;
  }
`;

export const summary = ({ ...props }) => css`
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-items: end;
  >div {
    margin-bottom: 8px;
  }
`;

export const summary_primary = ({ ...props }) => css`
  flex: 1 1 auto;
`;

export const summary_secondary = ({ ...props }) => css`
  flex: 0 0 auto;
`;

export const proseWrapper = ({ ...props }) => css`
  margin: 0 auto;
  width: 1200px;
  max-width: 100%;
`;
