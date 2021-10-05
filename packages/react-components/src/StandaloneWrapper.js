import React from "react";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import { LocaleProvider } from './dataManagement/LocaleProvider';

import { Root } from './components';
import ThemeContext, { lightTheme } from './style/themes';
import { ApiContext, ApiClient } from './dataManagement/api';
import env from '../.env.json';

const client = new ApiClient({
  gql: {
    endpoint: env.GRAPH_API,
  },
  v1: {
    endpoint: env.API_V1
  }
});

function StandaloneWrapper({
  defaultBaseName, theme = lightTheme, locale = 'en', messages: customMessages, ...props
}) {
  // const defaultBaseName = typeof window !== 'undefined' ? window.location.pathname : undefined;
  return (
    <ApiContext.Provider value={client}>
      <LocaleProvider locale={locale}>
        {/* <IntlProvider locale={locale} messages={customMessages || messages}> */}
          <ThemeContext.Provider value={theme}>
            <Root id="application" appRoot>
              <Router {...props} basename={defaultBaseName}>
                <QueryParamProvider ReactRouterRoute={Route} {...props} />
              </Router>
            </Root>
          </ThemeContext.Provider>
        {/* </IntlProvider> */}
      </LocaleProvider>
    </ApiContext.Provider>
  );
}

export default StandaloneWrapper;
