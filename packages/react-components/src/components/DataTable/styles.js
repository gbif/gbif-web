import { css } from '@emotion/react';
import { tooltip } from '../../style/shared';

export const wrapper = props => css`
  border: 1px solid ${props.theme.paperBorderColor};
  /* height: 100%; */
`;

export const occurrenceTable = ({theme}) => css`
  width: 100%;
  height: calc(100% - 30px);
  overflow: auto;
  position: relative;
  background: ${theme.paperBackground};
  flex: 1 1 auto;
  /* ${styledScrollBars(props)} */
`;

export const footer = ({theme}) => css`
  height: 30px;
  display: flex;
  flex-direction: row;
  padding: 0 10px;
  background: ${theme.paperBackground500};
  border-radius: 0 0 ${theme.borderRadius}px ${theme.borderRadius}px;
  border-top: 1px solid ${theme.paperBorderColor};
`;

export const footerItemBase = ({theme}) => css`
  flex: 0 0 auto;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  width: 30px;
  padding: 0;
  text-align: center;
  border: 1px solid transparent;
`;

export const footerItem = (props) => css`
  ${footerItemBase(props)};
  &:hover {
    border-color: ${props.theme.paperBorderColor};
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
  background: ${props.theme.background};
  border-spacing: 0;
  font-size: 85%;
  & th, td {
    border-right: 1px solid ${props.theme.paperBorderColor};
    transition: background-color 200ms ease;
    border-bottom: 1px solid ${props.theme.paperBorderColor};
    text-align: left;
  }
  & thead th {
    position: sticky;
    top: 0;
    border-bottom-width: 2px;
    background: ${props.theme.paperBackground500};
    color: ${props.theme.color600};
    padding: 8px 12px;
  }
  & td {
    padding: 12px;
    background: ${props.theme.paperBackground500};
  }
  & tbody>tr>td:first-of-type {
    border-right: 1px solid ${props.theme.paperBorderColor};
    background: ${props.theme.paperBackground500};
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

export const scrolled = ({theme}) => css`
  & td {
    background-color: ${theme.paperBackground600};
  }
  & thead th {
    background: ${theme.paperBackground700};
  }
  & thead th:first-of-type {
    background: ${theme.paperBackground500};
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

export const dataCell = ({noWrap, ...props}) => css`
  ${noWrap ? 'white-space: nowrap;' : ''}
`;

export const wide = props => css`
  min-width: 20em;
  ${cell(props)};
`;

export const noWrap = props => css`
  white-space: nowrap;
`;

export const tbodyLoading = ({theme}) => css`
  td > * {
    background-color: ${theme.color100}55;
    color: transparent;
  }
`;

export const paper = ({theme, color}) => css`
  background-color: ${theme['paperBackground' + color]};
`;
export const ink = ({theme, color}) => css`
  color: ${theme['color' + color]};
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