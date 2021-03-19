import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const iconFeatures = ({...props}) => css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: -.25em -1em;
  div {
    display: flex;
    align-items: center;
    margin: .25em 1em;
    flex: 0 0 auto;
    span {
      margin: 0 0.5em;
    }
  }
`;
