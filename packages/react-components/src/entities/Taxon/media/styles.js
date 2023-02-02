import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const imageDetails = ({ ...props }) => css`
  background: white;
  padding: 24px;
  margin-left: 24px;
  min-width: 450px;
`;

export const imageSelectCheck = (props) => css`
  position: absolute;
  left: 0;
  z-index: 100;
  background: black;
  color: white;
  padding: 5px 5px 2px 5px;
`;

export const imageContainer = ({ theme }) => css`
  background: #88888811;
  border: 1px solid #88888818;
  > img {
    display: block;
    margin: auto;
  }
`;

export const properties = css`
  margin-top: 24px;
  font-size: 85%;
`;
