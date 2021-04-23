import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const people = ({ ...props }) => css`
  display: flex;
  margin: 0 12px;
`;

export const navItem = ({ ...props }) => css`
  padding: 8px 12px;
  line-height: 1em;
  display: block;
  color: inherit;
  text-decoration: none;
  &.isActive {
    background: #e0e7ee;
    font-weight: 500;
  }
`;

export const search = ({ ...props }) => css`
  display: flex;
  margin-bottom: 24px;
  margin-left: 0;
  width: 100%;
  input {
    margin-right: 12px;
    height: auto;
  }
`;

export const nav = ({ ...props }) => css`
  flex: 0 0 280px;
  padding: 24px 12px;
  margin: 0;
  font-size: 14px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const info = ({ ...props }) => css`
  background: #65808a;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  margin-bottom: 12px;
`;

export const staffList = ({ ...props }) => css`
  flex: 1 1 100%;
`;

export const staffPosition = ({ ...props }) => css`
  margin-bottom: 18px;
  font-size: 85%;
  color: #888;
`;

export const staffDesc = ({ theme, ...props }) => css`
  flex: 1 1 auto;
  margin: 12px;
  a {
    color: ${theme.primary500};
    text-decoration: none;
  }
  h4 {
    margin: 0;
    font-weight: bold;
  }
`;

export const staffContact = ({ ...props }) => css`
  flex: 0 0 220px;
  display: flex;
  font-size: 14px;
  text-align: right;
  flex-direction: column;
  >div {
    flex: 1 1 auto;
  }
  background: #f8f8f8;
  padding: 12px;
`;

export const staffImage = ({ ...props }) => css`
  margin: 12px;
  flex: 0 0 auto;
`;
export const person = ({ ...props }) => css`
  background: white;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: nowrap;
  border: 1px solid #eee;
`;

