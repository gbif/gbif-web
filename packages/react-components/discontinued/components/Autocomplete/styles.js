import { css } from '@emotion/react';
import { styledScrollBars } from '../../style/shared';

export const wrapper = ({theme, ...props}) => css`
    display: inline-block;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    box-sizing: border-box;
    font-size: 14px;
    font-variant: initial;
    background-color: ${theme.paperBackground500};
    border-radius: ${theme.borderRadius}px;
    outline: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    width: 100%;
    position: absolute;
    transform: translateY(${props.isOpen ? 5 : 0}px);
    opacity: ${props.isOpen ? 1 : 0};
    z-index: ${props.isOpen ? 10 : null};
    transition: opacity .1s linear, transform .1s ease-in-out;
`;

export const item = ({theme, ...props}) => css`
  position: relative;
  display: block;
  padding: 5px 12px;
  overflow: hidden;
  // color: ${theme.color900}aa;
  font-weight: normal;
  line-height: 22px;
  cursor: pointer;
  transition: background 0.3s ease;
`;

export const menu = props => css`
  max-height: 450px;
  margin: 0;
  padding: 4px 0;
  padding-left: 0;
  overflow: auto;
  list-style: none;
  outline: none;
  ${styledScrollBars(props)}
`;

export default {
  wrapper,
  menu,
  item
}