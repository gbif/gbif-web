import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import { LocaleProvider } from './dataManagement/LocaleProvider';
import _get from 'lodash/get';
import _merge from 'lodash/merge';

import { Root } from './components';
import ThemeContext, { lightTheme } from './style/themes';
import { ApiContext, ApiClient } from './dataManagement/api';
import RouteContext, { defaultContext } from './dataManagement/RouteContext';
import SiteContext from './dataManagement/SiteContext';
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
  siteConfig = {},
  ...props
}) {
  const { 
    theme = lightTheme,
    locale = 'en',
    messages,
    routes
   } = siteConfig;

  const routeConfig = _merge({}, defaultContext, (routes || {}));
  const basename = _get(routeConfig, 'basename');
  const root = <Root id="application" appRoot>
    <Router {...props} basename={basename}>
      <QueryParamProvider ReactRouterRoute={Route} {...props} />
    </Router>
  </Root>;

  return (
    <SiteContext.Provider value={siteConfig}>
      <ApiContext.Provider value={client}>
        <LocaleProvider locale={locale} messages={messages}>
          <ThemeContext.Provider value={theme}>
            {routes && <RouteContext.Provider value={routeConfig}>
              {root}
            </RouteContext.Provider>}
            {!routes && root}
          </ThemeContext.Provider>
        </LocaleProvider>
      </ApiContext.Provider>
    </SiteContext.Provider>
  );
}

export default StandaloneWrapper;
