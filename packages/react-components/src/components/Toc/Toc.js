import { jsx } from "@emotion/react";
import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../../style/themes/ThemeContext";
import * as css from "./Toc.styles";
import { useLocation, useHistory } from "react-router-dom";
import _ from "lodash";

export const Toc = ({ refs, ...props }) => {
  const theme = useContext(ThemeContext);
  const location = useLocation();
  const history = useHistory();
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(location.hash ?  location.hash.substring(1) : null);
  useEffect(() => {
    // If theres an initial hash, scroll
    if (location.hash && refs[location.hash.substring(1)]) {
      scrollToSection(refs[location.hash.substring(1)]);
    }
    setSections(Object.keys(refs));
    const handleScroll = (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top > 200 ) {
        Object.keys(refs).forEach((hash) => {
          const elm = refs[hash];
          if (elm) {
            const rect = elm.getBoundingClientRect();
            if (rect.top > 0 && rect.top < 150  && "#"+hash !== location.hash) {
              history.push({ ...location, hash });
              setActiveSection(hash);
            }
          }
        });
      } else {
        history.push({ ...location, hash: null });
        setActiveSection(null);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [refs]);

 
  const scrollToSection = (elmn) => {
    if (elmn) {
      elmn.scrollIntoView();
    }
  };

  return (
    <ul>
      {sections.map((hash) => (
        <li key={hash}>
          <a
            href={`#${hash}`}
            onClick={(e) => {
              e.preventDefault()
              history.push({ ...location, hash });
              setActiveSection(hash);
              scrollToSection(refs[hash]);
            }}
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
