import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const iconFeature = ({...props}) => css`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  align-items: flex-start;
  svg {
    flex: 0 0 auto;
  }
  span, div {
    margin: 0 0.75em;
  }
`;

export const iconFeatures = ({...props}) => css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: -.25em -1em;
  div {
    ${iconFeature(props)}
    margin: .25em 1em;
  }
`;
