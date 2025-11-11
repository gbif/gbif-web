import { jsx } from '@emotion/react';
import React, { useMemo } from "react";
import { Button } from '../Button';
import { Menu } from '../Menu';
import { MenuRouteOption } from './NavItems';
import { useRouteMatch } from "react-router-dom";
import { MdMoreHoriz } from 'react-icons/md';

export default function OverflowMenu({ children, visibilityMap, ...props }) {
  const shouldShowMenu = useMemo(
    () => Object.values(visibilityMap).some((v) => v === false),
    [visibilityMap]
  );

  let moreLabel = <MdMoreHoriz style={{ fontSize: '1.5em' }} />
  let activeSubMenu = false;
  React.Children.map(children, (child) => {
    if (!visibilityMap[child.props["data-targetid"]]) {
      let isActive = useRouteMatch({
        path: child.props.to,
        exact: true
      });
      if (isActive) {
        moreLabel = child.props.label;
        activeSubMenu = true;
      }
    }
  });

  if (!shouldShowMenu) {
    return null;
  }

  return (
    <li {...props}>
      <Menu
        aria-label="Custom menu"
        trigger={<Button isIcon={true} appearance={activeSubMenu ? 'primary' : 'text'} truncate={true} style={{ maxWidth: 120 }}>{moreLabel}</Button>}
        items={menuState => React.Children.map(children, (child) => {
          if (!visibilityMap[child.props["data-targetid"]]) {
            const { onClick = ()=>{}, ...p } = child.props;
            return (
              <MenuRouteOption {...p} onClick={() => { onClick(); menuState.hide() }} />
            );
          }
          return null;
        })}
      />
    </li>
  );
}
