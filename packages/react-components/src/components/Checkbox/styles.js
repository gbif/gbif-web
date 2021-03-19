import { css } from '@emotion/react';
import { transparentInputOverlay } from '../../style/shared';

export const checkbox = props => css`
  position: relative;
  top: -0.09em;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  outline: none;
  cursor: pointer;
  input {
    ${transparentInputOverlay}
  }
  & input + span {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    width: 1em;
    height: 1em;
    background-color: ${props.theme.darkTheme ? props.theme.paperBackground700 : null};
    border: 1px solid #88888855;
    border-radius: ${Math.min(2, props.theme.borderRadius)}px;
    transition: all 0.1s;
    &:after {
      position: absolute;
      top: 50%;
      left: 30%;
      display: table;
      width: 40%;
      height: 60%;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg) scale(0) translate(-50%, -50%);
      opacity: 0;
      transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
      content: ' ';
    }
  }
  & input:checked + span {
    background-color: #1890ff;
    border-color: #1890ff;
    &:after {
      transform: rotate(45deg) scale(1) translate(-50%, -50%);
      opacity: 1;
      transition: all 0.1s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    }
  }
  & input:focus + span {
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  }
`;

export default {
  checkbox
}