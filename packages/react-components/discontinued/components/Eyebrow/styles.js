import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const eyebrow = ({...props}) => css`
  display: flex;
  justify-content: start;
  align-items: center;
  /* font-size: .85em; */
  white-space: nowrap;
`;

export const suffix = css`
  border: 2px solid #fdb002; // TODO, should somehow be defined by the theme. A secondary color perhaps. Primary doesn't look nice.
  border-width: 0 0 0 2px;
  margin-left: 6px;
  padding-left: 8px;
`;
