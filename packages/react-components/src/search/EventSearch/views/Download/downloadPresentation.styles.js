import { css } from '@emotion/react';
import { focusStyle } from '../../../../style/shared';

// export const mapArea = ({ theme }) => css``;

export const paper = ({ theme }) => css`
  background: white;
  border: 1px solid #eee;
  border-radius: 3px;
`;

export const dataset = ({ theme }) => css`
  ${paper({theme})}
  position: relative;
  padding: 10px 20px;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const actionOverlay = ({ theme }) => css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  ${focusStyle({theme})}
`;

export const title = ({ theme }) => css`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px 0;
  span {
    font-size: 80%;
    color: #999;
  }
`;
