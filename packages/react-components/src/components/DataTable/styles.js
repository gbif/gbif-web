import { css } from '@emotion/core';
import { tooltip } from '../../style/shared';

const borderRadius = '5px';
export const wrapper = props => css`
  border: 1px solid #e5ebed;
  height: 100%;
`;

export const occurrenceTable = props => css`
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  position: relative;
  background: white;
  /* ${styledScrollBars(props)} */
`;

export const footer = props => css`
  height: 50px;
  display: flex;
  flex-direction: row;
  padding: 0 10px;
  background: #f7f9fa;
  border-radius: 0 0 ${borderRadius} ${borderRadius};
`;

export const footerItemBase = props => css`
  flex: 0 0 auto;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  width: 30px;
  padding: 0;
  text-align: center;
  border: 1px solid transparent;
`;

export const footerItem = props => css`
  ${footerItemBase(props)};
  &:hover {
    border-color: #eaeaea;
  };
  &:active {
    background: #f0f2f3;
  }
  ${tooltip(props)}
`;

export const table = props => css`
  position: relative;
  min-width: 100%;
  border-collapse: separate;
  background: white;
  border-spacing: 0;
  font-size: 12px;
  & th, td {
    border-right: 1px solid #e5ebed;
    transition: background-color 200ms ease;
    border-bottom: 1px solid #e5ebed;
    text-align: left;
  }
  & thead th {
    position: sticky;
    top: 0;
    border-bottom-width: 2px;
    background: #f7f9fa;
    color: #8091a5;
    padding: 8px 12px;
  }
  & td {
    padding: 12px;
  }
  & tbody>tr>td:first-of-type {
    border-right: 1px solid #e5ebed;
    background: white;
  }
  ${props.stickyColumn ? stickyColumn(props) : ''};
  ${props.scrolled ? scrolled(props) : ''};
  /* ${props.scrollEnd ? scrollEnd(props) : ''}; */
`;

export const stickyColumn = props => css`
  & thead th:first-of-type {
    left: 0;
    z-index: 1;
  }
  & tbody>tr>td:first-of-type {
    position: sticky;
    left: 0;
  }
`;

// export const scrollEnd = props => css`
//   & thead th:last-of-type {
//     background: tomato;
//   }
// `;

export const scrolled = props => css`
  & td {
    background-color: #fbfbfb;
  }
  & thead th {
    background: #f1f3f5;
  }
  & thead th:first-of-type {
    background: #f7f9fa;
  }
`;

export const footerText = props => css`
  ${footerItemBase(props)};
  width: auto;
  font-size: 12px;
  text-align: center;
  flex: 1 1 auto;
`;

export const cell = props => css`
  display: flex;
  word-break: break-word;
`;

export const wide = props => css`
  width: 20em;
  ${cell(props)};
`;

export const tbodyLoading = props => css`
  td > * {
    background-color: #f3f3f3;
    color: transparent;
  }
`;

export default {
  wrapper,
  occurrenceTable,
  footer,
  footerItem,
  table,
  stickyColumn,
  scrolled,
  footerText,
  wide,
  tbodyLoading
};