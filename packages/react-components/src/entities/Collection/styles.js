import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';


export const headerWrapper = ({ ...props }) => css`
  background: white;
  padding: 1rem 1rem 0 1rem;
  h1 {
    margin-top: 0;
    margin-bottom: .25em;
    font-size: 2rem;
    font-weight: 700;
  }
  a {
    color: #1393D8;
  }
`;

export const summary = ({ ...props }) => css`
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  >div {
    margin-bottom: 8px;
  }
`;

export const proseWrapper = ({ ...props }) => css`
  margin: 0 auto;
  width: 1000px;
  max-width: 100%;
`;
