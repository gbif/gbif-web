import { css } from '@emotion/react';
import { focusStyle, placeholder } from '../../style/shared';

export const select =css`
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-block;
    width: 100%;
    height: 32px;
    padding: 4px 11px 8px 11px;
    color: var(--color900);
    font-size: inherit;
    line-height: 1.5;
    background-color: var(--paperBackground600);
    background-image: none;
    border: 1px solid #88888855;
    border-radius: var(--borderRadiusPx);
    transition: all 0.3s;
    ${focusStyle};
    ${placeholder};
`;

export default {
  select
}