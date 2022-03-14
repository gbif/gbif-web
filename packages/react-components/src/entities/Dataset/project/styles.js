import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const paper = ({ ...props }) => css`
  background: white;
  padding: 24px 48px;
  margin: 12px 0;
`;

export const withSideBar = ({ ...props }) => css`
  display: flex;
  /* margin: 0 12px; */
`;

export const sideBarNav = ({ ...props }) => css`
  background: white;
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const coverageItem_common = ({ ...props }) => css`
  color: #888;
  margin-left: 4px;
`;

export const coverageItem = ({ ...props }) => css`
  margin: 3px;
  padding: 1px 3px;
  border: 1px solid #ddd;
  display: inline-block;
  background: #efefef;
`;

export const sideBar = ({ ...props }) => css`
  flex: 0 0 250px;
  padding-top: 12px;
  margin: 0;
  font-size: 14px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100%;
`;



export const navItem = ({ ...props }) => css`
  padding: 8px 12px;
  line-height: 1em;
  display: block;
  color: inherit;
  width: 100%;
  text-align: left;
  text-decoration: none;
  &.isActive {
    background: #e0e7ee;
    font-weight: 500;
  }
`;