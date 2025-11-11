import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const contactList = ({ ...props }) => css`
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 0!important;
    &:last-of-type {
      border: none;
    }
  }
`;

export const contactListItem = ({ ...props }) => css`
  padding: 8px 0;
  h4 {
    font-size: inherit;
    margin: 0;
  }
  display: flex;
    align-items: center;
    > h4, > div {
      flex: 1 1 33%;
      padding: 0 8px;
    }
    a {
      color: inherit;
    }
    .gb-contactListImage {
      width: 48px;
      height: 48px;
      flex: 0 0 auto;
      border-radius: 4px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      padding: 0;
    }
  .gb-discreet {
    color: #555;
  }
  .gb-expandRow {
    flex: 0 0 auto;
  }
`;