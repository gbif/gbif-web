import { css } from '@emotion/core';
import { focusStyle, noUserSelect } from '../../style/shared';

export const arrowDown = ({size=5, color='#aaa', ...props}) => css`
  width: 0; 
  height: 0; 
  border-left:${size}px solid transparent;
  border-right: ${size}px solid transparent;
  border-top: ${size}px solid ${color};
`;

export const arrowUp = ({size=5, color='#aaa', ...props}) => css`
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

export const summary = ({...props}) => css`
  display: flex;
  align-items: center;
  padding: 12px 0 8px 0;
  border-bottom: 1px solid #eee;
  list-style: none;
  font-weight: 500;
  &::-webkit-details-marker {
    display: none;
  }
  ${focusStyle()}
  ${noUserSelect()}
`;

export default {
  accordion,
  summary,
  content,
  arrowDown,
  arrowUp
}