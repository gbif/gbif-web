import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const identifierBadge = ({...props}) => css`
  display: inline-block;
  border-radius: 3px;
  font-size: 0.85em;
  &:hover {
    color: #333;
    text-decoration: none;
    > *:first-child {
      background: #004d66;
      border-color: #004d66;
    }
  }
  > * {
    padding: 0 5px;
    display: inline-block;
    border: 1px solid #dbe3e7;
  }
  >*:first-child {
    transition: all .3s ease;
    background: #09c;
    padding: 0 4px;
    border-radius: 5px 0 0 5px;
    color: #fff;
    border-right-width: 0;
    border-color: #09c;
  }
  > *:last-child {
    background: #fff;
    padding: 0 7px;
    border-radius: 0 5px 5px 0;
    border-left-width: 0;
    color: #333;
    text-decoration: none;
  }
`;