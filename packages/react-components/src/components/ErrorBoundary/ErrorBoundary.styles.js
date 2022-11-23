import { css } from '@emotion/react';

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 1em;
  padding-bottom: 4em;
`;

export const actions = css`
  margin-top: 12px;
  margin-bottom: 24px;
  & .gbif-button {
    margin-left: 2px;
    margin-right: 2px;
  }
`;

export const stack = css`
  display: flex;
  flex-direction: column;
  text-align: left;
  max-height: 300px;
  overflow-y: auto;
  padding: 1em;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 1px 1px #0000000a;
  margin-top: 20px;
  & span {
    font-family: monospace;
    font-size: 14px;
  }
`;
