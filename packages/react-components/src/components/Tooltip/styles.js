import { css } from '@emotion/core';
import { root } from '../../style/shared';

export const tooltip = props => css`
  ${root(props)}
  font-size: 12px;
  background-color: rgba(33, 33, 33, 0.9);
  padding: 4px 8px;
  border-radius: ${props.theme.borderRadius}px;
  color: white;
`;

export default {
  tooltip
}