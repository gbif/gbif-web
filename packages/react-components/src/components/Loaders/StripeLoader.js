/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';

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

const before = ({error, theme}) => css`
  display: block;
  position: absolute;
  content: '';
  left: -200px;
  width: 200px;
  height: 1px;
  background-color: ${theme.colors.primary};
  animation: ${loading} 1.5s linear infinite;
  ${error ? errorStyle(theme) : null}
`;

export const StripeLoader = ({active, error, ...props}) => {
  const theme = useContext(ThemeContext);
  return <div css={css`
    height: 1px;
    width: 100%;
    position: relative;
    overflow: hidden;
    &:before {
      ${active ? before({error, theme}) : null}
    }`}></div>
}

// export const StripeLoader = styled.div`
//   height: 1px;
//   width: 100%;
//   position: relative;
//   overflow: hidden;
//   &:before {
//     ${props => props.active ? before(props) : null}
//   }
// `;
