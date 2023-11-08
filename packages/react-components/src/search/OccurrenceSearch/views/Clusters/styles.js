import { css, keyframes } from '@emotion/react';
import { tooltip } from '../../../../style/shared';

export const clusters = props => css`
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  background: white;
  border-radius: 4;
  border: 1px solid #e5ebed;
  display: block;

  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
  }

  .node {
    font-size: 2px;
  }

  .nodeContent {
    font-size: 2px;
    text-align: center;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    height: 100%;
    flex-direction: column;
    position: relative;
    z-index: 10;
  }
  .nodeContent-info {
    display: none;
  }
  .nodeContent:hover .nodeContent-info {
    display: block;
  }

  .node-circle {
    fill: rgb(82, 149, 164);
    stroke-width: 0px;
    &.node-entry {
      stroke: #427581;
    }
  }

  .node-capped {
    /* stroke: rgb(82, 149, 164);
    stroke-width: 2px; */
  }

  .node-entry {
    stroke-width: 3px;
  }

  .node-sequence {
    fill: #e9c0dc;
  }

  .node-type {
    fill: rgb(203, 56, 53);
  }

  .node-image {
    fill: rgb(44, 79, 123);
  }

  .node-specimen {
    fill: rgb(250, 185, 61);
    &.node-entry {
      stroke: #c18719;
    }
    ~ .nodeContent-wrapper {
      cursor: pointer;
    }
  }

  .node-deleted {
    fill: tomato;
  }

  .node-observation {
    ~ .nodeContent-wrapper {
      cursor: pointer;
    }
  }

  .node-treatment {
    fill: #56bda7;
    &.node-entry {
      stroke: #3f917f;
    }
    ~ .nodeContent-wrapper {
      cursor: pointer;
    }
  }

  .node-multiple-identifications + .node-overlay {
    display: block;
    fill: url(#diagonalHatch);
  }

  .node-overlay {
    display: none;
  }

  .nodeContent-wrapper {
    overflow: visible;
  }

  .node[data-highlight="false"] .nodeContent-wrapper {
    &:before {
      content: '';
      position: relative;
      display: block;
      width: 300%;
      height: 300%;
      box-sizing: border-box;
      margin-left: -100%;
      margin-top: -100%;
      border-radius: 45px;
      background-color: #01a4e9;
      animation: ${pulseRing} 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) forwards 2;//infinite;
    }
  }

  .node[data-highlight="true"] .nodeContent-wrapper {
    box-shadow: 0 0 0px 10px #91919155;
  }

  .nodeContent-wrapper {
    border-radius: 50%;
  }
  
  /* Hover effect on nodes */
  /* .nodeContent-wrapper:hover {
    box-shadow: 0 0 10px 10px #ff000055;
    border-radius: 50%;
    overflow: visible;
    background: deepskyblue;
  } */
  
`;

// A pulse animation that is used to highlight nodes as they are desselected
export const pulseRing = keyframes`
  0% {
    opacity: 1;
    transform: scale(.33);
  }
  80%, 99% {
    opacity: 0;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(.33);
  }
`;

export const footer = ({ theme }) => css`
  height: 30px;
  display: flex;
  flex-direction: row;
  padding: 0 10px;
  background: ${theme.paperBackground500};
  border-radius: 0 0 ${theme.borderRadius}px ${theme.borderRadius}px;
  border-top: 1px solid ${theme.paperBorderColor};
`;

export const footerItemBase = ({ theme }) => css`
  flex: 0 0 auto;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  width: 30px;
  padding: 0;
  text-align: center;
  border: 1px solid transparent;
`;

export const footerItem = (props) => css`
  ${footerItemBase(props)};
  &:hover {
    border-color: ${props.theme.paperBorderColor};
  };
  &:active {
    background: #f0f2f3;
  }
  ${tooltip(props)}
`;

export const footerText = props => css`
  ${footerItemBase(props)};
  width: auto;
  font-size: 12px;
  text-align: center;
  flex: 1 1 auto;
`;

export const clusterWrapper = props => css`
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  >div:first-of-type {
    width: 100%;
    flex: 1 1 auto;
    overflow: hidden;
    position: relative;
  }
`;

export const meta = props => css`
  flex: 1 0 280px;
  margin-left: 8px;
`;

export const main = props => css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
  flex: 1 1 auto;
`;


export const card = props => css`
  background: white;
  border: 1px solid #eee;
`;

export const headline = props => css`
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  h2 {
    font-size: 15px;
    font-weight: normal;
    flex: 1 1 auto;
    margin: 0;
    padding: 12px;
  }
  button {
    flex: 0 0 auto;
    padding: 12px;
  }
`;

export const contentWrapper = props => css`
  overflow: auto;
  /* max-height: 300px; */
`;

export const content = props => css`
  margin: 12px;
  font-size: 13px;
`;

export const tooltipContent = props => css`
  position: absolute;

  padding: 8px;
  height: auto;
  background: #333;
  color: white;
  border-radius: 4px;
  font-size: .85em;
  width: auto;
  max-width: 450px;
  > div {
    margin-bottom: 12px;
  }
  > div:last-of-type {
    margin-bottom: 0;
  }
`;

export const tooltipWrapper = props => css`
  position:absolute;
  visibility:hidden;
  z-index:9999;
  pointer-events: none;
`;

export const stripes = css`
  background-image: linear-gradient(-45deg, #00000000 25%, #00000088 25%, #00000088 50%, #00000000 50%, #00000000 75%, #00000088 75%, #00000088 100%);
  background-size: 12px 12px;
  border: 1px solid #bbb;
`;

export const legendItem = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding-bottom: 8px;
  > div:first-of-type {
    width: 30px;
    text-align: center;
    >div {
      margin: auto;
    }
  }
  > * {
    flex: 0 0 auto;
    margin-right: 12px;
  }
`;

export const requestError = css`
  text-align: center;
  margin-top: 48px;
  flex: 1 1 auto;
  div {
    margin-top: 12px;
  }
`;