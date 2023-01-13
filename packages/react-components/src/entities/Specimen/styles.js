import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';


export const tab = ({ noData, ...props }) => css`
  color: ${noData ? '#888' : null};
`;

export const tabCountChip = ({ ...props }) => css`
  background: #88888847;
  color: #00000085;
  padding: 2px 5px;
  font-size: 10px;
  border-radius: 4px;
  margin: 0 4px;
  font-weight: bold;
`;

export const headerWrapper = ({ ...props }) => css`
  background: white;
  padding: 1rem 1rem 0 1rem;
  h1 {
    margin-top: 0;
    margin-bottom: .25em;
    font-size: 2rem;
    font-weight: 700;
  }
  a {
    color: #1393D8;
  }
`;

export const summary = ({ ...props }) => css`
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  >div {
    margin-bottom: 8px;
  }
`;

export const proseWrapper = ({ ...props }) => css`
  margin: 0 auto;
  width: 1000px;
  max-width: 100%;
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
  width: 100%;
  height: 100%;
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

export const group = () => css`
  margin-top: 12px;
  background: white;
  border-radius: 4px;
  h2 {
    padding: 24px 24px 0 24px;
    margin-top: 0;
  }
  >div>dl {
    padding: 0 24px;
    padding-bottom: 24px;
  }
`;

export const properties = css`
  
`;

export const accordionGroup = () => css`
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