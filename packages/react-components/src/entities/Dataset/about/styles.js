import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const paper = ({ transparent, ...props }) => css`
  padding: 24px 48px;
  margin: 12px 0;
  ${transparent ? '' : `
    background: white;
    border: 1px solid var(--paperBorderColor);
    border-radius: var(--borderRadiusPx);
  `}
`;

export const withSideBar = ({ hasSidebar, ...props }) => css`
  display: grid;
  grid-template-columns: 1fr ${hasSidebar ? '350px' : ''};
  grid-column-gap: 12px;
`;

export const sideBarNav = ({ ...props }) => css`
  top: var(--stickyOffset);
  position: sticky;
  div {
    background: white;
    margin-bottom: 12px;
    overflow: hidden;
    padding: 4px;
    border: 1px solid var(--paperBorderColor);
    border-radius: var(--borderRadiusPx);
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
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

export const area = css`
  background: white;
  border-radius: var(--borderRadiusPx);
  margin-bottom: 8px;
  border: 1px solid var(--paperBorderColor);
`;

export const sidebarCard = css`
  padding: 12px;
  display: flex;
  /* box-shadow: 0 2px 3px 3px rgba(0,0,0,.02); */
  /* background: white;
  margin-bottom: 8px;
  border-radius: 4px; */
`;

export const sidebarIcon = css`
  flex: 0 0 auto;
  div {
    padding: 8px 0;
    text-align: center;
    background: var(--primary500);
    color: white;
    font-weight: 900;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    line-height: 25px;
    padding: 0;
    text-align: center;
    padding-top: 2px;
  }
`;

export const progress = css`
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  > div {
    background: var(--primary500);
    height: 4px;
    border-radius: 2px;
  }
  margin-bottom: 12px;
`;

export const sidebarCardWrapper = css`
  img {
    width: 100%;
    border-radius: 4px 4px 0 0;
  }
`;

export const sidebarCardContent = css`
  padding-left: 12px;
  flex: 1 1 auto;
  a {
    color: inherit;
    text-decoration: none;
  }
  h5 {
    font-size: 13px;
    margin: 3px 0 0 0;
    font-weight: bold;
  }
  p {
    font-size: 13px;
    color: #888;
    margin: 0;
    margin-top: 8px;
  }
`;

export const thumbnail = css`
  position: relative;
  height: 0;
  padding-bottom: 50%;
  width: 100%;
  background: #ddd;
  > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    > img {
      width: 50%;
      display: inline-block;
    }
  }
`;


const galleryHeight = '200';
export const galleryBar = css`
  height: ${galleryHeight}px;
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 0 -6px;
  > a {
    position: absolute;
    margin: 12px;
    bottom: 0;
    right: 0;
  }
  > div {
    display: flex;
    overflow-x: auto;
    height: ${galleryHeight + 100}px;
    padding-bottom: 100px;
    > div {
      margin-right: 10px;
      flex: 0 0 auto;
      height: ${galleryHeight}px;
    }
  }
  img, .gb-image-failed {
    display: block;
    height: ${galleryHeight}px;
    margin: 0 6px;
    max-width: initial;
  }
  .gb-image-failed {
    > div {
      height: 100%;
      margin: auto;
      padding: 24px 50px;
      font-size: 24px;
      color: var(--color100);
      background: rgba(0,0,0,.05);
    }
  }
`;