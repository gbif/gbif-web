import React from "react";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";

import OccurrenceSearch from "./OccurrenceSearch";
import { en } from "../../locales/en";
import ThemeContext, { lightTheme } from '../../style/themes';

class Standalone extends React.Component {
  render() {
    const { style } = this.props;
    return (
      <IntlProvider locale='en' messages={en}>
        <ThemeContext.Provider value={lightTheme}>
          <OccurrenceSearch style={style} />
        </ThemeContext.Provider>
      </IntlProvider>
    );
  }
}

Standalone.propTypes = {
  theme: PropTypes.object,
  settings: PropTypes.object,
  locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default Standalone;
