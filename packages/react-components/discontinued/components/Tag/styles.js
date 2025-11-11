import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const tags = ({ ...props }) => css`
  margin: -2px;
  display: inline-block;
  > * {
    margin: 2px;
    display: inline-block
  }
`;

export const tag = ({ type, outline, ...props }) => css`
  /* font-size: 85%;
  border-radius: 4px;
  padding: 3px 6px; */
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #4a4a4a;
  display: inline-flex;
  font-size: .85em;
  /* height: 2em; */
  justify-content: center;
  line-height: 1.5;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
  ${types[type] ? types[type]({ props }) : null}
  ${outline ? 'border: 1px solid var(--paperBorderColor)' : null}
`;

const bgColors = {
  error: '#ff6c4b',
  warning: '#ffbf4b',
  info: '#3298dc',
  success: '#48c774',
  white: '#fff',
  light: '#f5f5f5',
  dark: '#363636'
};
const colors = {
  error: '#fff',
  warning: '#5f4515',
  info: '#fff',
  success: '#fff',
  white: 'rgba(0,0,0,.7)',
  light: 'rgba(0,0,0,.7)',
  dark: '#fff'
}

const types = {
  error: props => css`
    background-color: ${bgColors.error};
    color: ${colors.error};
  `,
  warning: props => css`
    background-color: ${bgColors.warning};
    color: ${colors.warning};
  `,
  info: props => css`
    background-color: ${bgColors.info};
    color: ${colors.info};
  `,
  success: props => css`
    background-color: ${bgColors.success};
    color: ${colors.success};
  `,
  white: props => css`
    background-color: ${bgColors.white};
    color: ${colors.white};
  `,
  light: props => css`
    background-color: ${bgColors.light};
    color: ${colors.light};
  `,
  dark: props => css`
    background-color: ${bgColors.dark};
    color: ${colors.dark};
  `
}

export const alert = ({type}) => css`
  display: inline-flex;
  background-color: ${bgColors[type]}dd;
  color: ${colors[type]};
  padding: 0.5rem;
  align-items: center;
  border-radius: var(--borderRadiusPx);
  text-decoration: none;
  align-items: flex-start;
  &:hover {
    color: ${colors[type]};
    text-decoration: none;
  }
  > div {
    margin: 0 0.5rem;
    flex: 1 1 auto;
  }
`;