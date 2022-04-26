import { css } from '@emotion/react';

export const headline = ({ theme, ...props }) => css`
  color: ${theme.color};
  margin-top: 0;
  // max-width: 950px; // Somewhat randomly chosen simply to avoid very looong lines that is hard to read
`;
