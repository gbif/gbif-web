import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const progress = ({color, unknown, ...props}) => css`
  background: var(--transparentInk10);
  border-radius: 2px;
  height: 4px;
  ${unknown ? `background-image: repeating-linear-gradient(45deg, #fafafa, #fafafa 5px, #eee 5px, #eee 10px);` : null}
  position: relative;
  overflow: hidden;
  > div {
    transition: width 300ms;
    height: 100%;//px;
    background: ${color ? color : 'var(--primary)'};
    max-width: 100%;
    position: absolute;
  }
`;

export const progressItem = ({subtleText}) => css`
  display: flex;
  align-items: end;
  color: ${subtleText ? 'var(--color400)' : 'inherit'};
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 500;
  > div {
    flex: 1 1 auto;
  }
  > span {
    flex: 0 0 auto;
    margin-left: 8px;
  }
`;

export default {
  progress
}