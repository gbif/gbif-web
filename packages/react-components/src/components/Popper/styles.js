import { css } from '@emotion/core';
import { focusStyle } from '../../style/shared';

const arrowPlacement = {
  top: css`
    bottom: -29px;
  `,
  bottom: css`
    top: -29px;
  `,
  left: css`
    right: -29px;
  `,
  right: css`
    left: -29px;
  `,
}

export const popper = ({...props}) => css`
  border: 1px solid rgba(0,0,0,.2);
  ${focusStyle()};
  z-index: 1000;
`;

export const arrow = ({visible, placement}) => css`
  display: ${visible? 'block' : 'none'};
  width: 30px;
  height: 30px;
  pointer-events: none;
  ${arrowPlacement[placement]};
  .gb-popover-arrow-stroke {
    fill: rgba(0,0,0,.2);
  }
  .gb-popover-arrow-fill {
    fill: white;
  }
`;

const backdrop = () => css`
  background-color: rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 500;
`;

export default {
  popper,
  arrow,
  backdrop
}