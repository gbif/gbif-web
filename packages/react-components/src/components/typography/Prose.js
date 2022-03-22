
import { css, jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';

export const Prose = ({
  as: Div = 'div',
  ...props
}) => {
  const theme = useContext(ThemeContext);
  return <Div {...props} css={prose({ theme })}>
  </Div>
};

function getTag(tagName, styleFn) {
  return function ({ as: Tag = tagName, ...props }) {
    const theme = useContext(ThemeContext);
    return <Tag {...props} css={styleFn(theme)} />
  }
}

export const ol = (theme) => css`
  div>p:first-child {
    margin-top: 0;
  }
  ol {
    counter-reset: listitem;
    list-style: none; 
  }
  ol>li {
    position: relative;
    margin: 4px 0;
    padding-left: 32px;
  }
  ol>li:before {
    counter-increment: listitem;
    content: counter(listitem);
    background: #e3e8ee;
    color: #697386;
    font-size: 12px;
    font-weight: 500;
    line-height: 10px;
    text-align: center;
    padding: 5px 0;
    height: 20px;
    width: 20px;
    border-radius: 10px;
    position: absolute;
    left: 0;
  }
`;

export const h6 = (theme) => css`
  font-size: 10px;
  line-height: 18px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 600;
`;

export const h5 = (theme) => css`
  font-size: 12px;
  line-height: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  color: #32536a;
`;

export const h4 = (theme) => css`
  font-size: 18px;
  line-height: 24px;
`;

export const h3 = (theme) => css`
  font-size: 20px;
  line-height: 24px;
  font-family: ${theme.headerFontFamily};
`;

export const h2 = (theme) => css`
  font-size: 28px;
  line-height: 36px;
  font-family: ${theme.headerFontFamily};
`;

export const h1 = (theme) => css`
  font-size: 36px;
  line-height: 48px;
  font-family: ${theme.headerFontFamily};
`;

export const a = (theme) => css`
  color: ${theme.linkColor};
`;

export const prose = ({ theme = {} }) => css`
  -webkit-font-smoothing: antialiased;
  line-height: 1.3em;
  /* line-break: anywhere; might be relevant on smaller devices*/
  /* a {
    ${a(theme)};
  } */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
  }
  h1 {
    ${h1(theme)};
  }
  h2 {
    ${h2(theme)};
  }
  h3 {
    ${h3(theme)};
  }
  h4 {
    ${h4(theme)};
  }
  h5 {
    ${h5(theme)};
  }
  h6 {
    ${h6(theme)};
  }
  ${ol(theme)};
  ul {
    padding-inline-start: 1em;
    li {
      margin-bottom: .5em;
    }
  }
  p {
    margin-bottom: 8px;
  }
`;


Prose.H1 = getTag('h1', h1);
Prose.H2 = getTag('h2', h2);
Prose.H3 = getTag('h3', h3);

Prose.A = getTag('a', a);

Prose.css = {
  a,
  h1, h2, h3, h4, h5
}