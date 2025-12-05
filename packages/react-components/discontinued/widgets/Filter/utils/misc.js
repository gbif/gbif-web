import { css, jsx } from '@emotion/react';
import ThemeContext from '../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { styledScrollBars } from '../../../style/shared';

// to use theme do e.g.: color: ${props => props.theme.primary};
export function FilterBox(props) {
  const theme = useContext(ThemeContext);
  return <div {...props} css={css`
    display: flex;
    flex-direction: column;
    max-height: inherit;
    background: ${theme.paperBackground200};
  `} />
}

// https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
// I would never have thought of this myself.
export const scrollBox = ({theme}) => css`
  background:
    /* Shadow covers */
    linear-gradient(${theme.paperBackground500} 30%, ${theme.paperBackground500}00),
    linear-gradient(${theme.paperBackground500}00, ${theme.paperBackground500} 70%) 0 100%,
    
    /* Shadows */
    linear-gradient(to bottom, ${theme.paperBorderColor} 1px, transparent 1px 100%),
    linear-gradient(to bottom, transparent calc(100% - 1px), ${theme.paperBorderColor} calc(100% - 1px) 100%);
  background-repeat: no-repeat;
  background-color: ${theme.paperBackground500};
  background-size: 100% 10px, 100% 10px, 100% 20px, 100% 100%;
  
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;
`;

const description = css`
  padding-top: 20px;
  padding-bottom: 20px;
`;

export function FilterBody(props) {
  const theme = useContext(ThemeContext);
  return <div {...props} css={css`
    ${scrollBox({theme})}
    /* border-bottom: 1px solid #eee; */
    padding: .5em 1.5em;
    flex: 1 1 auto;
    overflow: auto;
    scrollbar-width: thin;
    max-height: 350px;
    ${styledScrollBars({theme})}
  `} />
};

export function FilterBodyDescription(props) {
  return <FilterBody {...props} css={css`
    padding-top: 20px;
    padding-bottom: 20px;
  `} />
};

// export const FilterBodyDescription = styled(FilterBody)`
//   padding-top: 20px;
//   padding-bottom: 20px;
// `;