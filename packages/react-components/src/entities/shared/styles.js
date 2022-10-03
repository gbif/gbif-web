import { css } from '@emotion/react';

export const headline = css`
  margin-top: 0;
  margin-bottom: .25em;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color);
  display: inline-block;
  // max-width: 950px; // Somewhat randomly chosen simply to avoid very looong lines that is hard to read
`;

export const headerWrapper = css`
  background: var(--paperBackground);
  border-bottom: 1px solid var(--paperBorderColor);
  font-size: 16px;
`;

export const contentWrapper = css`
  margin: 0 auto;
  width: 1350px;
  max-width: 100%;
  padding: 12px 12px 0 12px;
  margin-left: max(0px, calc((100vw - 1350px) / 2));
`;

export const summary = css`
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-items: end;
`;

export const summary_primary = css`
  flex: 1 1 auto;
`;

export const summary_secondary = css`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  svg {
    position: relative;
    top: 0.1em;
  }
`;