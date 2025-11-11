import { css } from '@emotion/react';

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 96px 1em;
  min-height: 80vh;
  background: white;
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
  overflow: auto;
  padding: 1em;
  background-color: var(--paperBackground);
  border: 1px solid var(--paperBorderColor);
  border-radius: var(--borderRadiusPx);
  max-width: 100%;
  pre {
    font-family: monospace;
    font-size: 14px;
  }
`;
