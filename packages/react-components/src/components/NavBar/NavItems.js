import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import * as styles from './styles';
import { Link, useRouteMatch } from "react-router-dom";

export const NavTab = React.forwardRef(({
  label,
  to,
  icon,
  exact,
  className,
  ['data-targetid']: targetId,
  ['data-inmenu']: inMenu,
  isActive,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  let activeRoute = useRouteMatch({
    path: to,
    exact: exact
  });
  let Comp = to ? Link : 'span';
  return <li ref={ref} data-targetid={targetId} data-inmenu={inMenu} css={styles.routerTab({ theme, isActive: activeRoute || isActive })} className={className}>
    <Comp to={to} {...props}>
      {icon}
      {label}
    </Comp>
  </li>
});

export const MenuRouteOption = React.forwardRef(({
  label,
  to,
  icon,
  exact,
  className,
  ['data-targetid']: targetId,
  isActive,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  let activeRoute = useRouteMatch({
    path: to,
    exact: exact
  });
  let Comp = to ? Link : 'span';
  return <Comp to={to} ref={ref} data-targetid={targetId} css={styles.routerOption({ theme, isActive: activeRoute || isActive  })} className={className} {...props}>
    {icon}
    {label}
  </Comp>
});