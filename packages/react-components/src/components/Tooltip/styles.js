import { css } from '@emotion/react';
import { root } from '../../style/shared';

export const tooltip = css`
  ${root}
  font-size: 14px;
  background-color: #333;
  padding: 4px 8px;
  border-radius: var(--borderRadiusPx);
  color: white;
  z-index: 1000;
`;

export const tooltipArrow = css`
  path {
    fill: #333;
  }
`;