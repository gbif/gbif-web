import { css } from '@emotion/react';
import { root } from '../../style/shared';

export const tooltip = props => css`
  ${root(props)}
  font-size: 14px;
  background-color: #333;
  padding: 4px 8px;
  border-radius: ${props.theme.borderRadius}px;
  color: white;
  z-index: 1000;
`;

export const tooltipArrow = props => css`
  path {
    fill: #333;
  }
`;