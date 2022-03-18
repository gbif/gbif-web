import { css } from '@emotion/react';

export const headline = ({ theme, ...props }) => css`
  color: ${theme.color};
  margin-top: 0;
  max-width: 850px;
`;
