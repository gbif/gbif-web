import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

// we might be able to use something like https://codepen.io/sosuke/pen/Pjoqqp
// to control color client side if we had black thumbnail styles from mapnik

export const thumbnail = css`
  position: relative;
  height: 0;
  padding-bottom: 50%;
  width: 100%;
  background: #ddd;
  overflow: hidden;
  > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    > img {
      width: 50%;
      display: inline-block;
    }
  }
`;