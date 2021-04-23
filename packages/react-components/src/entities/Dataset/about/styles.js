import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const paper = ({ ...props }) => css`
  background: white;
  padding: 24px;
`;

export const withSideNav = ({ ...props }) => css`
  display: flex;
  margin: 0 12px;
`;

export const sideNav = ({ ...props }) => css`
  flex: 0 0 250px;
  padding: 24px 0;
  margin: 0;
  font-size: 14px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const navItem = ({ ...props }) => css`
  padding: 8px 12px;
  line-height: 1em;
  display: block;
  color: inherit;
  text-decoration: none;
  &.isActive {
    background: #e0e7ee;
    font-weight: 500;
  }
`;