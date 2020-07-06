import { css } from '@emotion/core';
import styled from '@emotion/styled';

// to use theme do e.g.: color: ${props => props.theme.colors.primary};
export const FilterBox = styled.div`
  display: flex;
  flex-direction: column;
  max-height: inherit;
  background: white;
`;

// https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
// I would never have thought of this myself.
export const scrollBox = css`
  background:
    /* Shadow covers */
    linear-gradient(white 30%, rgba(255,255,255,0)),
    linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
    
    /* Shadows */
    linear-gradient(to bottom, #eee 1px, transparent 1px 100%),
    linear-gradient(to bottom, transparent calc(100% - 1px), #eee calc(100% - 1px) 100%);
  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 10px, 100% 10px, 100% 20px, 100% 100%;
  
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;
`;

const description = css`
  padding-top: 20px;
  padding-bottom: 20px;
`;

export const FilterBody = styled.div`
  ${scrollBox}
  /* border-bottom: 1px solid #eee; */
  padding: .5em 1.5em;
  flex: 1 1 auto;
  overflow: auto;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #686868;
  }
`;

export const FilterBodyDescription = styled(FilterBody)`
  padding-top: 20px;
  padding-bottom: 20px;
`;