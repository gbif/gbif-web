import React from "react";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";
import { BrowserRouter as Router } from "react-router-dom";

import { Root } from './components';
import ThemeContext, { lightTheme } from './style/themes';
import { ApiContext, ApiClient } from './dataManagement/api';
import env from '../.env.json';

import flatten from 'flat';
import { en as enNested } from './locales/en';
const en = flatten(enNested);

const client = new ApiClient({
  gql: {
    endpoint: env.GRAPH_API,
  },
  v1: {
    endpoint: env.API_V1
  }
});

function StandaloneWrapper({
  theme = lightTheme, locale = 'en', messages = en, ...props
}) {
  return (
    <ApiContext.Provider value={client}>
      <IntlProvider locale={locale} messages={messages}>
        <ThemeContext.Provider value={theme}>
          <Root id="application" appRoot>
            <Router {...props} />
          </Root>
        </ThemeContext.Provider>
      </IntlProvider>
    </ApiContext.Provider>
  );
}

export default StandaloneWrapper;
