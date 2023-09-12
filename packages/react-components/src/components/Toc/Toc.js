import { jsx } from "@emotion/react";
import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../../style/themes/ThemeContext";
import * as css from "./styles";
import { useLocation, useHistory } from "react-router-dom";
import _ from "lodash";
import { useToc } from "./useToc";

function compareRef(a, b) {
  if (a.index < b.index) {
    return -1;
  } else if (a.index > b.index) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

export const Toc = ({ refs, ...props }) => {
  const theme = useContext(ThemeContext);
  const [sections, setSections] = useState([]);

  const [ activeSection, clickHandlers , setRefs] = useToc();

  useEffect(() => {
    // refs is either an object of key: reference or key: { node, index } where index is for sorting
    // create object with {key: node} for useToc
    const refObject = {};
    const sortedSections = [];
    const refArray = Object.keys(refs).map((key) => {
      if (refs[key].node) {
        return { key, ...refs[key] };
      } else {
        return { key, node: refs[key] };
      }
    }).sort(compareRef);
    
    refArray.forEach((section, index) => {
      refObject[section.key] = section.node;
      sortedSections.push(section);
    });

    setRefs(refObject)
    setSections(sortedSections)
  }, [refs]);

  return (
    <ul>
      {sections.map(section => (
        <li key={section.key}>
          <a
            href={`#${section.key}`}
            onClick={clickHandlers[section.key]}
            className={activeSection === section.key ? "isActive" : null}
            css={css.navItem}
          >
            {section.title ?? _.startCase(section.key)}
          </a>
        </li>
      ))}
    </ul>
  );
}

function TocNavItem(props) {
  return <a css={css.navItem} {...props} />
}

Toc.NavItem = TocNavItem;