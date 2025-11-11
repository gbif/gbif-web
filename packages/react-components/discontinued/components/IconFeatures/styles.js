import { css } from '@emotion/react';
import { discreetLink } from '../../style/shared';
// import { focusStyle } from '../../style/shared';

export const iconFeature = ({...props}) => css`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  align-items: flex-start;
  max-width: 100%;
  >svg, >span:first-of-type {
    flex: 0 0 auto;
    height: 1.2em; // because that is our lineheight in root and we want this centered on the first line. We cannot siply center with flex, because we want it top aligned when there are multiple lines
  }
  >svg + span, >svg + div {
    margin: 0 0.75em;
  }
  a {
    ${discreetLink};
  }
`;

export const countFeature = ({...props}) => css`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  align-items: flex-start;
  >span:first-of-type {
    background: #555;
    color: white;
    font-size: 13px;
    padding: 1px 4px;
    border-radius: 3px;
    margin: 0;
  }
  >span:nth-of-type(2), >div {
    margin: 0 0.5em;
  }
  a {
    ${discreetLink};
  }
`;

export const iconFeatures = ({...props}) => css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: -.25em 0;
  > div {
    ${iconFeature(props)}
    margin: .25em 1em 0.25em 0;
  }
`;

