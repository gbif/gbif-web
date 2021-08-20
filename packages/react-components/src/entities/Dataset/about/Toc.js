import { jsx } from "@emotion/react";
import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../../../style/themes/ThemeContext";
import * as css from "./styles";
import { useLocation, useHistory } from "react-router-dom";
import _ from "lodash";
// Hashes to dataset attrs. If the Toc should be reused in other pages, this could be given from the parent instead
const SECTIONS = [
  { hash: "description", dataAttr: "description" },
  { hash: "purpose", dataAttr: "purpose" },
  { hash: "temporal-scope", dataAttr: "temporalCoverages" },
  { hash: "geographic-scope", dataAttr: "geographicCoverages" },
  { hash: "taxonomic-scope", dataAttr: "taxonomicCoverages" },
  { hash: "methodology", dataAttr: "samplingDescription" },
  { hash: "additional-info", dataAttr: "additionalInfo" },
  { hash: "contacts", dataAttr: "contributors" },
  { hash: "bibliographic-citations", dataAttr: "bibliographicCitations" },
  { hash: "citation", dataAttr: "citation" },
];
export function Toc({ data, className, selector = "h2", ...props }) {
  const theme = useContext(ThemeContext);
  const location = useLocation();
  const history = useHistory();
  const [activeSection, setActiveSection] = useState(location.hash || null);
  useEffect(() => {
    // If theres an initial hash, scroll
    if (location.hash) {
      scrollToSection(location.hash);
    }
    const headings = document.querySelectorAll(selector);
    const handleScroll = (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top > 200) {
        headings.forEach((ha) => {
          const rect = ha.getBoundingClientRect();
          if (rect.top > 0 && rect.top < 150) {
            history.push({ ...location, hash: ha.id });
            setActiveSection(ha.id);
          }
        });
      } else {
        history.push({ ...location, hash: null });
        setActiveSection(null);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sect) => {
    const elmn = document.getElementById(sect);
    if (elmn) {
      elmn.scrollIntoView();
    }
  };

  return (
    <ul>
      {SECTIONS.filter(({dataAttr}) => !!data[dataAttr]).map(({hash, dataAttr}) => (
        <li key={hash}>
          <a
            onClick={(e) => {
              history.push({ ...location, hash });
              setActiveSection(hash);
              scrollToSection(hash);
            }}
            className={activeSection === hash ? "isActive" : null}
            css={css.navItem({ theme })}
          >
            {/* TODO translation */}
            {_.startCase(dataAttr)}
          </a>
        </li>
      ))}
    </ul>
  );
}
