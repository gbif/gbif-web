import React from "react";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";

import { Root } from '../../components';
import OccurrenceSearch from "./OccurrenceSearch";
import ThemeContext, { lightTheme } from '../../style/themes';
import { ApiContext, ApiClient } from '../../dataManagement/api';
import env from '../../../.env.json';

import flatten from 'flat';
import { en as enNested } from '../../locales/en';
import EnsureRouter from '../../EnsureRouter';

const en = flatten(enNested);

const client = new ApiClient({
  gql: {
    endpoint: env.GRAPH_API,
  },
  v1: {
    endpoint: env.API_V1
  }
});

function Standalone(props) {
  const { style, config, theme = lightTheme, locale = 'en', messages = en } = props;
  return (
    <ApiContext.Provider value={client}>
      <IntlProvider locale={locale} messages={messages}>
        <ThemeContext.Provider value={theme}>
          <Root id="application" appRoot>
            <EnsureRouter>
              <OccurrenceSearch style={style} config={config} />
            </EnsureRouter>
          </Root>
        </ThemeContext.Provider>
      </IntlProvider>
    </ApiContext.Provider>
  );
}

Standalone.propTypes = {
  theme: PropTypes.object,
  settings: PropTypes.object,
  locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default Standalone;
