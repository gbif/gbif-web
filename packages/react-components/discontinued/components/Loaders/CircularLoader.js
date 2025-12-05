
import { css, jsx, keyframes } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { getClasses } from '../../utils/util';


export const ldsRing = keyframes`
  0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;

export const loading = css`
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 80%;
      height: 80%;
      margin: 8px;
      border: 2px solid #fff;
      border-radius: 50%;
      animation: ${ldsRing} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #fff transparent transparent transparent;
    }
    div:nth-of-type(1) {
      animation-delay: -0.45s;
    }
    div:nth-of-type(1) {
      animation-delay: -0.45s;
    }
    div:nth-of-type(2) {
      animation-delay: -0.3s;
    }
    div:nth-of-type(3) {
      animation-delay: -0.15s;
    }
`;

export function CircularLoader({ active, error, className, ...props }) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'stripeLoader', { active, error }, className);
  return <div {...classNames} css={loading}><div></div><div></div><div></div><div></div></div>
}