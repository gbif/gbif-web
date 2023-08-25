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

const contentWidth = 1450;

export const contentWrapper = css`
  margin: 0 auto;
  width: ${contentWidth}px;
  max-width: 100%;
  padding: 12px 12px 0 12px;
  margin-left: max(0px, calc((100vw - ${contentWidth}px) / 2));
  @media (min-width: 1200px) {
    padding: 12px 36px 0 36px;
  }
`;

export const summary = css`
  margin-top: 1.5rem;
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

export const cardMargins = css`
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const cardProse = css`
  margin-bottom: 24px;
  max-width: 60em;
  font-size: 16px;
`;

export const cardProperties = css`
  margin-bottom: 12px;
  font-size: 16px;
  p {
    margin-top: 0;
  }
`;

export const withSideBar = ({ hasSidebar, ...props }) => css`
  display: grid;
  grid-template-columns: 1fr ${hasSidebar ? '350px' : ''};
  grid-column-gap: 12px;
  // on smaller screen, then make sidebar a bit narrower
  @media (max-width: 1200px) {
    grid-template-columns: 1fr ${hasSidebar ? '300px' : ''};
  }
`;

export const sideBarNav = ({ ...props }) => css`
  top: var(--stickyOffset);
  position: sticky;
  ul {
    list-style: none;
    padding: 0;
    margin: 8px 0;
  }
`;

export const sideBar = ({ ...props }) => css`
  flex: 0 0 250px;
  margin: 0;
  font-size: 14px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100%;
`;