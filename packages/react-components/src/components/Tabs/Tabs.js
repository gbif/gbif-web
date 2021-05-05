
// intersting warning about the standard story about aria tabs https://simplyaccessible.com/article/danger-aria-tabs/
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { oneOfMany } from '../../utils/util';
import * as styles from './styles';
import { uncontrollable } from 'uncontrollable';

import { Link, useRouteMatch } from "react-router-dom";

export const TabsContext = React.createContext({});

const ControlledTabs = ({
  activeId,
  onChange,
  ...props
}) => {
  return (
    <TabsContext.Provider value={{ activeId, onChange }} {...props} />
  );
};
ControlledTabs.propTypes = {
  activeId: PropTypes.string,
  defaultActiveId: PropTypes.string,
  onChange: PropTypes.func,
}

export const TapSeperator = ({vertical, props}) => {
  const theme = useContext(ThemeContext);
  return <li css={styles.tabSeperator({ theme, vertical })} {...props}>&nbsp;</li>
}

export const TapSpacer = props => {
  const theme = useContext(ThemeContext);
  return <li css={styles.tabSpacer({ theme })} {...props}></li>
}

export const Tabs = uncontrollable(ControlledTabs, {
  activeId: 'onChange'
});

export const TabList = ({
  vertical = false,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  return <ul
    css={styles.tabList({ theme, vertical })}
    {...props} />
};
TabList.displayName = 'TabList';
// now that this is being used as links with routes it seems less interesting?
// TabList.propTypes = {
//   ['aria-label']: oneOfMany(['aria-label', 'aria-labelledby'])
// };

export const RouterTab = ({
  direction,
  label, 
  to,
  exact,
  className,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  let isActive = useRouteMatch({
    path: to,
    exact: exact
  });
  return <li css={styles.routerTab({ theme, isActive, direction })} className={className}>
    <Link to={to} {...props}>{label}</Link>
  </li>
};

export const Tab = ({
  tabId,
  direction,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const tabContext = useContext(TabsContext);
  const isActive = tabContext.activeId === tabId;
  const tabProps = {
    'aria-selected': isActive ? true : false,
    'aria-controls': `${tabId}_panel`,
    'role': 'button',
    'id': `${tabId}_tab`,
    'onClick': () => tabContext.onChange(tabId)
  }
  return <li
    tabIndex="0"
    css={styles.tab({ theme, isActive, direction })}
    {...tabProps}
    {...props}
  />
};
Tab.displayName = 'Tab';
Tab.propTypes = {
  as: PropTypes.node,
  tabId: PropTypes.string,
  direction: PropTypes.string,
  children: PropTypes.any,
};

export const TabPanel = ({
  tabId,
  lazy,
  ...props
}) => {
  // const theme = useContext(ThemeContext);
  const tabContext = useContext(TabsContext);
  const isActive = tabContext.activeId === tabId;
  if (lazy && !isActive) return null;
  return <div
    id={`${tabId}_panel`}
    aria-labelledby={`${tabId}_tab`}
    // css={styles.tabs({theme})}
    hidden={!isActive}
    {...props} />
};
TabPanel.displayName = 'TabPanel';
TabPanel.propTypes = {
  tabId: PropTypes.string,
  lazy: PropTypes.bool,
};

Tabs.Tab = Tab;
Tabs.TabList = TabList;
Tabs.TabPanel = TabPanel;
Tabs.TapSeperator = TapSeperator;
Tabs.TapSpacer = TapSpacer;
Tabs.RouterTab = RouterTab;