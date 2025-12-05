import { css } from '@emotion/react';
import { transparentInputOverlay } from '../../style/shared';

export const radio = props => css`
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
    border: 1px solid #d9d9d9;
    border-radius: 100px;
    transition: all 0.1s;
    &:after {
      position: absolute;
      top: 0px;
      left: 0px;
      display: table;
      width: 100%;
      height: 100%;
      border: 3px solid #1890ff;
      border-radius: 100px;
      opacity: 0;
      transition: all .2s cubic-bezier(.78,.14,.15,.86);
      content: ' ';
    }
  }
  & input:checked + span {
    border-color: #1890ff;
    &:after {
      opacity: 1;
    }
  }
  & input:focus + span {
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  }
`;

export default {
  radio
}