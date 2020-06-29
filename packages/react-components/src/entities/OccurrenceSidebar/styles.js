import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const globeOverlay = ({...props}) => css`
  position: absolute;
  border: 1px solid #ccc;
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 100%;
  background-image: radial-gradient(farthest-corner at 30% 35%, #ffffffa6 0%, #fff0 40%);
`;
export const globe = ({...props}) => css`
  position: relative;
  width: 50px;
  height: 50px;
`;

export const globeSvg = ({...props}) => css`
  position: absolute;
  top: 0;

  .land {
    fill: #a7a7a7;
  }
  .graticule {
    stroke: #c3c3c3;
    fill: transparent;
    stroke-width: 0.3px;
  }
  .sphere {
    fill: #e4e4e4;
  }
  .point {
    fill: #1fa7fd;
    stroke: #3b92ce;
    animation: hideshow 1s ease infinite;
  }
  /* @keyframes hideshow {
    0% { stroke-width: 2px; }
    50% { stroke-width: 10px; }
    100% { stroke-width: 2px; }
  } */
`;

export const sideBar = ({...props}) => css`
  background: white;
`;

export const detailDrawerBar = props => css`
  border: 1px solid #e8e8e8;
  border-width: 0 1px;
`;

export const detailDrawerContent = props => css`
  overflow: auto;
  flex: 1 1 auto;
  >div {
    /* width: 500px; */
    max-width: 100%;
  }
`;

export const headline = props => css`
  >img {
    margin-right: 24px;
  }
  >h3 {
    display: inline-block;
    margin: 0;
  }
`;

export const accordion = props => css`
  font-size: 14px;
  margin: 20px 0;
`;

export const imageContainer = props => css`
  background: #fafafa;
  border: 1px solid #eee;
  >img {
    display: block;
    margin: auto;
  }
`;