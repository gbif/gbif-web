import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const entitySummary = ({ ...props }) => css`
  font-size: 13px;
  margin-top: 12px;
  margin-left: -12px;
  margin-right: -12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  >div {
    display: inline-block;
    margin: 4px 12px;
    display: flex;
    align-items: center;
    svg {
      margin-right: 4px;
    }
  }
`;

export const header = ({ ...props }) => css`
  .gbif-header-location {
    font-size: 13px;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
`;

export const breadcrumbSeperator = ({ ...props }) => css`
  border-left: 2px solid orange;
  margin-left: 6px;
  height: 1em;
  padding-left: 6px;
`;

export const breadcrumb = ({ ...props }) => css`
  font-size: 11px;
    margin-bottom: 6px;
    /* font-weight: 500; */
    /* color: #5a5a5a; */
`;

export const globeOverlay = ({ theme, ...props }) => css`
  position: absolute;
  border: 1px solid #88888811;
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 100%;
  background-image: radial-gradient(farthest-corner at 30% 35%, ${theme.darkTheme ? '#ffffff33' : '#ffffffaa'} 0%, #fff0 30%);
`;
export const globe = ({ ...props }) => css`
  position: relative;
  width: 75px;
  height: 75px;
`;

export const globeSvg = ({ isTrackingData, theme, ...props }) => css`
  position: absolute;
  top: 0;

  .land {
    fill: #88888844;
  }
  .graticule {
    stroke: #88888840;
    fill: transparent;
    stroke-width: 0.3px;
  }
  .sphere {
    /* fill: ${theme.darkTheme ? '#e4e4e4' : '#e4e4e4'}; */
    fill: #88888822;
  }
  .point {
    fill: ${theme.color700};
    ${isTrackingData ? `
    fill: #ff3800;
    stroke: #ff38006e;
    animation: hideshow 1s ease infinite;
    ` : null}
  }
  @keyframes hideshow {
    0% { stroke-width: 2px; }
    50% { stroke-width: 10px; }
    100% { stroke-width: 2px; }
  }
`;

export const sideBar = ({ theme, ...props }) => css`
  background: ${theme.paperBackground500};
  position: relative;
`;

export const detailDrawerBar = ({ theme }) => css`
  border: 1px solid ${theme.paperBorderColor};
  border-width: 0 1px;
  color: ${theme.darkTheme ? theme.color600 : theme.color900};
`;

export const detailDrawerContent = ({ theme }) => css`
  overflow: auto;
  flex: 1 1 auto;
  >div {
    /* width: 500px; */
    max-width: 100%;
  }
`;

export const headline = ({ theme }) => css`
  >img {
    margin-right: 24px;
  }
  >h3 {
    display: inline-block;
    margin: 0;
  }
`;

export const controlFooter = ({ theme }) => css`
  /* position: absolute; */
  /* margin: 8px 12px; */
  bottom: 0;
  left: 0;
  padding: 4px 8px;
  border-top: 1px solid ${theme.paperBorderColor};
  /* border-radius: 4px; */
  bottom: 0;
  right: 0;
  font-size: 12px;
  /* box-shadow: 0 0 5px 5px #ffffff; */
  background: ${theme.paperBackground500};
`;

export const accordion = ({ theme }) => css`
  font-size: 13px;
  margin: 20px 0;
`;

export const imageContainer = ({ theme }) => css`
  background: #88888811;
  border: 1px solid #88888818;
  margin-top: 12px;
  >img {
    display: block;
    margin: auto;
  }
`;