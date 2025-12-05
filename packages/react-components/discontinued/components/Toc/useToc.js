import { useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useEventListener } from "./useEventListener";

const scrollToSection = (elmn) => {
  if (elmn) {
    elmn.scrollIntoView();
  }
};

export const useToc = () => {
  const location = useLocation();
  const history = useHistory();
  const [sections, setSections] = useState({});
  const [activeSection, setActiveSection] = useState(
    location.hash ? location.hash.substring(1) : null
  );
  const [clickHandlers, setClickHandlers] = useState({});

  const handleScroll = useCallback(
    (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top > 200) {
        Object.keys(sections).forEach((hash) => {
          const elm = sections[hash];
          if (elm) {
            const rect = elm.getBoundingClientRect();
            if (
              rect.top > 0 &&
              rect.top < 150 &&
              "#" + hash !== location.hash
            ) {
              history.replace({ ...location, hash });
              setActiveSection(hash);
            }
          }
        });
      } else {
        history.replace({ ...location, hash: null });
        setActiveSection(null);
      }
    },
    [sections]
  );
  useEventListener("scroll", handleScroll, document);
  const setRefs = (refs) => {
    // If theres an initial hash, scroll
    if (location.hash && refs[location.hash.substring(1)]) {
      scrollToSection(refs[location.hash.substring(1)]);
    }
    setSections(refs);
    setClickHandlers(
      Object.keys(refs).reduce(
        (obj, key) => (
          (obj[key] = (e) => {
            e.preventDefault();
            history.replace({ ...location, key });
            setActiveSection(key);
            scrollToSection(refs[key]);
          }),
          obj
        ),
        {}
      )
    );
  };
  return [activeSection, clickHandlers, setRefs];
};
