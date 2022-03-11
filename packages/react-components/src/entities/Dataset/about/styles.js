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

export const testcard = css`
  margin-right: 12px;
  padding: 12px;
  display: flex;
  /* box-shadow: 0 2px 3px 3px rgba(0,0,0,.02); */
  background: white;
  margin-bottom: 8px;
  border-radius: 4px;
`;

export const testicon = css`
  flex: 0 0 auto;
  div {
    padding: 8px 0;
    text-align: center;
    background: #a147ff;
    color: white;
    font-weight: 900;
    border-radius: 6px;
    width: 50px;
  }
`;

export const progress = css`
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  > div {
    background: #76cb7a;
    height: 4px;
    border-radius: 2px;
  }
  margin-bottom: 12px;
`;

export const testcontent = css`
  padding-left: 12px;
  flex: 1 1 auto;
  h5 {
    font-size: 13px;
    margin: 0 0 12px 0;
  }
  p {
    font-size: 13px;
    color: #888;
    margin: 0;
  }
`;