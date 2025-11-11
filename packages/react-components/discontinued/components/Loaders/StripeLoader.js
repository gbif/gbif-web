
import { css, jsx, keyframes } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { getClasses } from '../../utils/util';

export const loading = keyframes`
  from {
    left: -200,
    width: 30% 
  }
  50% {
    width: 30%
  }
  70% {
    width: 70%
  }
  80% {
    left: 50%
  }
  95% {
    left: 120%
  }
  to {
    left: 100%
  }
`;

const errorStyle = theme => css`
  background-color: tomato;
  left: 0;
  animation: none;
  width: 100%;
`;

const before = ({ error, theme }) => css`
  display: block;
  position: absolute;
  content: '';
  left: -200px;
  width: 200px;
  height: 1px;
  background-color: ${theme.primary};
  animation: ${loading} 1.5s linear infinite;
  ${error ? errorStyle(theme) : null}
`;

export function StripeLoader({ active, error, className, ...props }) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'stripeLoader', {active, error}, className);
  return <div {...classNames} css={css`
    height: 1px;
    width: 100%;
    position: relative;
    overflow: hidden;
    &:before {
      ${active ? before({ error, theme }) : null}
    }`}></div>
}