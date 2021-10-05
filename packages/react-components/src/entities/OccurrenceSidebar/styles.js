import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const agentSummary = ({ ...props }) => css`
  border-radius: 4px;
  border: 1px solid #eee;
  background: white;
  overflow: hidden;
  box-shadow: 0 2px 3px 3px rgb(0 0 0 / 2%);
  > div:last-of-type {
    flex: 1 1 auto;
    padding: 12px;
  }
  > div:first-of-type {
    flex: 0 0 auto;
    img {
      display: block;
    }
  }
  h4 {
    margin: 0;
  }
`;

export const features = ({ ...props }) => css`
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const entitySummary = ({ ...props }) => css`
  font-size: 13px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const header = ({ ...props }) => css`
  margin: 0 16px;
  .gbif-header-location {
    font-size: 13px;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
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
  max-width: 100%;
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
    font-size: 1.2em;
    font-weight: 700;
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
  font-size: 16px;
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

export const clusterCard = ({ theme }) => css`
  margin-bottom: 24px;
  border: 1px solid ${theme.paperBorderColor};
  box-shadow: 0 2px 1px 1px #0000000a;
`;

export const properties = css`
  font-size: 85%;
`;

export const group = () => css`
  summary {
    background: #f5f5f5;
    padding-left: 16px;
    padding-right: 16px;
    border-width: 1px 0;
    border: 1px solid #eee;
    border-width: 1px 0;
  }
  >div {
    margin: 0 16px 32px 16px;
  }
`;

export const chip = ({ theme }) => css`
  font-size: 11px;
  padding: 0 4px;
  border: 1px solid #dedede;
  background: #f3f3f3;
  margin: 0 4px 4px 0;
  display: inline-block;
`;

export const clusterFooter = ({ theme }) => css`
  font-size: 13px;
  padding: 8px 12px;
  border-top: 1px solid ${theme.paperBorderColor};
  margin-bottom: -4px;
`;

export const termRemark = props => css`
  opacity: 0.5;
`;

export const issuePill = ({ severity, ...props }) => css`
  background: ${severity === "WARNING" ? "#ffbf4b" : "#a4cdd2"};
  font-size: 85%;
  color: ${severity === "WARNING" ? "#5f4515" : "#2f585d"};
  border-radius: 4px;
  padding: 0 4px;
  margin-right: 4px;
`;
