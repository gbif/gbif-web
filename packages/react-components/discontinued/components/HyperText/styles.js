import { css } from '@emotion/react';

export const content = ({inline} = {}) => css`
  ${inline ? 'display: inline-block;' : null}
  /* a {
    text-decoration: none;
    color: var(--linkColor);
    &:hover {
      text-decoration: underline;
    }
  } */
`