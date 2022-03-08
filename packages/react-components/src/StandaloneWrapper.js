import React from "react";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import { LocaleProvider } from './dataManagement/LocaleProvider';
import _get from 'lodash/get';

import { Root } from './components';
import ThemeContext, { lightTheme } from './style/themes';
import { ApiContext, ApiClient } from './dataManagement/api';
import RouteContext, { defaultContext } from './dataManagement/RouteContext';
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
  defaultBaseName, theme = lightTheme, locale = 'en', messages: customMessages, routeContext, ...props
}) {
  // const defaultBaseName = typeof window !== 'undefined' ? window.location.pathname : undefined;
  const basename = _get(routeContext, 'basename');
  const root = <Root id="application" appRoot>
    <Router {...props} basename={basename}>
      <QueryParamProvider ReactRouterRoute={Route} {...props} />
    </Router>
  </Root>;

  return (
    <ApiContext.Provider value={client}>
      <LocaleProvider locale={locale}>
        {/* <IntlProvider locale={locale} messages={customMessages || messages}> */}
        <ThemeContext.Provider value={theme}>
          {routeContext && <RouteContext.Provider value={{ ...defaultContext, ...routeContext }}>
            {root}
          </RouteContext.Provider>}
          {!routeContext && root}
        </ThemeContext.Provider>
        {/* </IntlProvider> */}
      </LocaleProvider>
    </ApiContext.Provider>
  );
}

export default StandaloneWrapper;
