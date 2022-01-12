// this implementation is largely based on https://dev.to/shubhamreacts/how-to-implement-a-collapsible-overflow-menu-in-react-5cn8

import { jsx } from '@emotion/react';
import React, { useRef, useEffect, useState } from "react";
import OverflowMenu from "./OverflowMenu";
import { NavTab } from './NavItems';
import * as styles from './styles';

export function NavItem(props) {
  <li {...props} />
}

export function NavBar({ children, ...props }) {
  const navRef = useRef(null);

  const [visibilityMap, setVisibilityMap] = useState({});
  const handleIntersection = (entries) => {
    const updatedEntries = {};
    entries.forEach((entry) => {
      const targetid = entry.target.dataset.targetid;
      if (entry.isIntersecting && !entry.target.dataset.inmenu) {
        updatedEntries[targetid] = true;
      } else {
        updatedEntries[targetid] = false;
      }
    });

    setVisibilityMap((prev) => ({
      ...prev,
      ...updatedEntries
    }));
  };
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: navRef.current,
      threshold: 1,
      rootMargin: '0px -100px 0px 0px'
    });

    // We are addting observers to child elements of the container div
    // with ref as navRef. Notice that we are adding observers
    // only if we have the data attribute observerid on the child elemeent
    Array.from(navRef.current.children).forEach((item) => {
      if (item.dataset.targetid) {
        observer.observe(item);
      }
    });
    return () => observer.disconnect();
  }, []);
  return (
    <ol css={styles.toolbarWrapper} ref={navRef} {...props} >
      {React.Children.map(children, (child) => {
        return <NavTab {...child.props} css={!!visibilityMap[child.props["data-targetid"]] ? styles.visible : styles.invisible} />
        // return cloneElement(child, {
        //   css: !!visibilityMap[child.props["data-targetid"]] ? visible : invisible
        // });
      })}
      <OverflowMenu
        visibilityMap={visibilityMap}
        css={styles.overflowStyle}
      >
        {children}
      </OverflowMenu>
    </ol>
  );
}

const cloneElement = (element, props) =>
  jsx(element.type, {
    key: element.key,
    ref: element.ref,
    ...element.props,
    ...props,
  });