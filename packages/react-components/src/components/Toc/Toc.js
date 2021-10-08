import { jsx } from "@emotion/react";
import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../../style/themes/ThemeContext";
import * as css from "./Toc.styles";
import { useLocation, useHistory } from "react-router-dom";
import _ from "lodash";
import { useToc } from "./useToc";

export const Toc = ({ refs, ...props }) => {
  const theme = useContext(ThemeContext);
  const [sections, setSections] = useState({});

  const [ activeSection, clickHandlers , setRefs] = useToc();

  useEffect(() => {
    setRefs(refs)
    setSections(refs)
  }, [refs]);

 


  return (
    <ul>
      {Object.keys(sections).map((hash) => (
        <li key={hash}>
          <a
            href={`#${hash}`}
            onClick={clickHandlers[hash]}
            className={activeSection === hash ? "isActive" : null}
            css={css.navItem({ theme })}
          >
            {/* TODO translation */}
            {_.startCase(hash)}
          </a>
        </li>
      ))}
    </ul>
  );
}
