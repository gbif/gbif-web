import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const nameAvatar = css`
  background: var(--color100);
    display: inline-block;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    line-height: 48px;
    text-align: center;
    font-weight: 900;
    font-size: 15px;
`;

export const listItem = css`
  padding: 16px 24px;
`;

export const listItemCard = css`
  background: white;
  border-radius: var(--borderRadiusPx);
  border: 1px solid #eee;
  ${listItem};
`;

export const action = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  > * {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
  }
  svg {
    margin-inline-end: 6px;
  }
`;

export const footerActions = css`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -16px;
  > div {
    flex: 0 0 auto;
    color: #888;
    margin: 4px 16px;
    border-right: 1px solid #eee;
    &:first-of-type {
      padding-left: 0;
    }
    &:last-of-type {
      padding-right: 0;
      border: 0;
    }
    a {
      color: inherit;
      text-decoration: none;
      transition: color 150ms ease;
      &:hover {
        color: var(--linkColor);
      }
    }
  }
`;

export const content = css`
`;

export const description = css`
  color: #888;
`;

export const headline = css`
  margin: 8px 0 12px 0;
  font-size: 1.05rem;
  a {
    color: inherit;
    text-decoration: none;
    transition: color 150ms ease;
    &:hover {
      color: var(--linkColor);
    }
  }
`;

export const avatar = css`
  flex: 0 0 auto;
  margin-right: 12px;
`;

export const titleWrapper = css`
  flex: 1 1 auto;
`;

export const header = css`
  display: flex;
  margin-bottom: 16px;
`;
