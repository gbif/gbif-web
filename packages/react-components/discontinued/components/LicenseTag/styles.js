import { css } from '@emotion/react';

export const licenseTag = ({theme, ...props}) => css`
  color: white;
  background-color: #555;
  font-size: 13px;
  padding: 0.125em 0.5em;
  border-radius: ${theme.borderRadius}px;
  text-decoration: none;
`;