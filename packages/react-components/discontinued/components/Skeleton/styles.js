import { css } from '@emotion/react';
import { skeletonLoading } from '../../style/shared';

export const skeleton = ({inlineElement, width}) => css`
  width: ${typeof width === 'number' ? `${width}px` : width};
  ${inlineElement ? 'display: inline-block;': null}
  height: 1em;
  margin-bottom: 0.3em;
  animation: ${skeletonLoading} 3s linear infinite;
`;