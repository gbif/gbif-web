/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled'
import React, { useState, useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';

import { helper } from '../../utils/helper';
import { forEach, map } from '../../utils/elementChildren';

const Tab = styled.li`
  display: block;
`;

const TabButton = ({ active, children, eventKey, onClick, ...props }) => {
  const theme = useContext(ThemeContext);
  return (
    <a role="tab"
      css={css`
      align-items: center;
      border-bottom-color: #dbdbdb;
      border-bottom-style: solid;
      color: #4a4a4a;
      display: flex;
      justify-content: center;
      margin-bottom: -2px;
      padding: 0.5em 1em;
      vertical-align: top;
      background: none;
      border-width: 0 0 2px 0;
      font-size: 1em;
      &:hover {
        border-bottom-color: #363636;
        color: #363636;
      }
      ${active ? `
        border-bottom-color: ${theme.colors.primary500};
        color: ${theme.colors.primary500};
      ` : ''}
    `}
      onClick={e => onClick(props.tabKey)}
      {...props}
    >
      {children}
    </a>
  )
};

function getDefaultActiveKey(children) {
  let defaultActiveKey;
  forEach(children, child => {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props.eventKey;
    }
  });

  return defaultActiveKey;
}

function renderTab(child) {
  const { eventKey, disabled, tabClassName } = child.props;
  return (
    <li
      // eventKey={eventKey}
      disabled={disabled}
      className={tabClassName}
      role="tab"
      onClick={e => console.log(eventKey)}
    >
      { child }
    </li>
  );
}

const Tabs = (props) => {
  const {
    children,
    onSelect,
    activeKey = getDefaultActiveKey(children),
    ...controlledProps
  } = useUncontrolled(props, {
    activeKey: 'onSelect',
  });

  const [key, setKey] = useState(activeKey);
  // console.log(children);
  // children.forEach(x => console.log(x.props.eventKey));
  const theme = useContext(ThemeContext);
  return <nav css={css`
        ${helper.noUserSelect}
        -webkit-overflow-scrolling: touch;
        align-items: stretch;
        display: flex;
        font-size: 1em;
        justify-content: space-between;
        overflow: hidden;
        overflow-x: auto;
        white-space: nowrap;
      `} {...controlledProps}>
    <ul role="tablist" css={css`
          align-items: center;
          margin: 0;
          padding: 0;
          border-bottom-color: #dbdbdb;
          border-bottom-style: solid;
          border-bottom-width: 2px;
          display: flex;
          flex-grow: 1;
          flex-shrink: 0;
          justify-content: flex-start;
        `}>
      {map(children, c => renderTab(c, onSelect))}
    </ul>
  </nav>
}

Tabs.displayName = 'Tabs';

Tabs.propTypes = {
  className: PropTypes.string
}

Tabs.Tab = TabButton;

export default Tabs