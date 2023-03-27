import { css } from '@emotion/react';

export const content = ({inline, lineClamp} = {}) => css`
  ${inline ? 'display: inline-block;' : null}
  ${lineClamp ? `
  display: -webkit-box;
  -webkit-line-clamp: ${lineClamp};
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden; 
  ` : null}
  a {
    text-decoration: none;
    color: var(--linkColor);
    &:hover {
      text-decoration: underline;
    }
  }
`