import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const majorRanks = ({ ...props }) => css`
  &>span:after {
    font-style: normal;
    content: ' ❯ ';
    font-size: 80%;
    color: #ccc;
    display: inline-block;
    padding: 0 3px;
  }
  &>span:last-of-type:after {
    display: none;
  }
  .gbif-unknownRank {
    opacity: 0.5;
  }
`;