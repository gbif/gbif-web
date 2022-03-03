import { css } from '@emotion/react';
import { focusStyle, noUserSelect } from '../../style/shared';

export const arrowDown = ({size=5, color='#88888855', ...props}) => css`
  width: 0; 
  height: 0; 
  border-left:${size}px solid transparent;
  border-right: ${size}px solid transparent;
  border-top: ${size}px solid ${color};
`;

export const arrowUp = ({size=5, color='#88888855', ...props}) => css`
  width: 0; 
  height: 0; 
  border-left: ${size}px solid transparent;
  border-right: ${size}px solid transparent;
  border-bottom: ${size}px solid ${color};
`;

export const content = ({...props}) => css`
  padding-top: 8px;
`;

export const accordion = ({...props}) => css`

`;

export const summary = ({theme, ...props}) => css`
  > div {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
  padding: 12px 0 8px 0;
  /* border-bottom: 1px solid ${theme.color100}; */
  list-style: none;
  list-style-type: none;
  /* font-weight: 500; */
  ${focusStyle()}
  ${noUserSelect()}
  &::-webkit-details-marker {
    display:none;
  }
`;

export default {
  accordion,
  summary,
  content,
  arrowDown,
  arrowUp
}