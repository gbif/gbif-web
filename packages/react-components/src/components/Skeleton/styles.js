import { css } from '@emotion/react';
import { skeletonLoading } from '../../style/shared';

export const skeleton = ({width}) => css`
  width: ${width};
  display: inline-block;
  height: 1em;
  margin-bottom: 0.3em;
  animation: ${skeletonLoading} 3s linear infinite;
`;