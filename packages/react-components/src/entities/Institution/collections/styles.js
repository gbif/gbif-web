import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';
export { bulletList } from '../../../style/shared';

export const comment = css`
  font-size: 13px;
  font-weight: 900;
  color: #888;
  white-space: nowrap;
`;

export const headline = css`
  margin: 10px 0;
  font-weight: bold;
  font-size: 20px;
  ${main}
`;

export const main = css`
  height: 20px;
`;

export const summary = ({ ...props }) => css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  > div {
    &:first-of-type {
      flex: 1 1 auto;
      text-align: start;
    }
    flex: 0 0 130px;
    text-align: center;
  }
`;

export const active = ({ ...props }) => css`
  padding: 5px;
  border-radius: var(--borderRadiusPx);
  background: var(--primary);
  color: white;
  text-align: center;
  display: inline-block;
`;

export const collectionCard = ({ ...props }) => css`
  margin: 24px 0;
  h4 {
    margin: 0;
  }
`;

// inspired by https://codepen.io/alvaromontoro/pen/LYjZqzP
export const progressCircular = ({ percent = 10, size, ...props }) => css`
  width: ${size};
  height: ${size};
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: 
    radial-gradient(closest-side, white 80%, transparent 0 99.9%, white 0),
    conic-gradient(var(--primary) calc(${percent} * 1%), var(--paperBackground900) 0)
    ;
  font-family: Helvetica, Arial, sans-serif;
  line-height: ${size};
  text-align: center;
  display: inline-block;
`;

export const collections = ({ ...props }) => css`
  display: flex;
  margin-top: -12px;
`;