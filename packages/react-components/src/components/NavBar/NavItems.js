import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import * as styles from './styles';
import { Link, useRouteMatch } from "react-router-dom";

export const RouterTab = React.forwardRef(({
  label,
  to,
  icon,
  exact,
  className,
  ['data-targetid']: targetId,
  ['data-inmenu']: inMenu,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  let isActive = useRouteMatch({
    path: to,
    exact: exact
  });
  let Comp = to ? Link : 'span';
  return <li ref={ref} data-targetid={targetId} data-inmenu={inMenu} css={styles.routerTab({ theme, isActive })} className={className}>
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
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  let isActive = useRouteMatch({
    path: to,
    exact: exact
  });
  let Comp = to ? Link : 'span';
  return <Comp to={to} ref={ref} data-targetid={targetId} css={styles.routerOption({ theme, isActive })} className={className} {...props}>
    {icon}
    {label}
  </Comp>
});