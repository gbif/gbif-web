import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import { LocaleProvider } from './dataManagement/LocaleProvider';
import _get from 'lodash/get';
import _merge from 'lodash/merge';
import { ToastContainer } from 'react-toast'
import { Root } from './components';
import { lightTheme, ThemeProvider } from './style/themes';
import { ApiContext, ApiClient } from './dataManagement/api';
import RouteContext, { defaultContext } from './dataManagement/RouteContext';
import SiteContext from './dataManagement/SiteContext';
import env from '../.env.json';
import { GraphQLContextProvider } from "./dataManagement/api/GraphQLContext";

const client = new ApiClient({
  gql: {
    endpoint: env.GRAPH_API,
  },
  v1: {
    endpoint: env.API_V1
  },
  esApi: {
    endpoint: env.ES_WEB_API
  },
  translations: {
    endpoint: env.TRANSLATIONS
  }
});

function StandaloneWrapper({
  siteConfig = {},
  id,
  ...props
}) {
  const {
    theme = lightTheme,
    locale = 'en',
    messages,
    routes = {}
  } = siteConfig;

  // a temporary fallback for sites that haven't added explicit configuration for what routes to include
  // instead use the routes that have been explicitly configured
  const fallbackRoutes = ['occurrenceSearch', 'institutionKey', 'institutionSearch', 'publisherSearch', 'collectionKey', 'collectionSearch', 'literatureSearch', 'datasetKey', 'publisherKey'];
  const enabledRoutesFallback = Object.keys(routes).filter(key => fallbackRoutes.includes(key));
  enabledRoutesFallback.push('occurrenceSearch', 'collectionSearch', 'institutionSearch', 'publisherSearch', 'literatureSearch', 'eventSearch');
  const routeConfig = _merge({}, defaultContext, routes);
  //handle previous versions of routeConfig
  if (!siteConfig?.version || siteConfig?.version < 2) routeConfig.alwaysUseHrefs = true;
  routeConfig.enabledRoutes = routeConfig?.enabledRoutes ?? enabledRoutesFallback;

  const basename = _get(routeConfig, 'basename');
  const root = <Root id="application" appRoot>
    <Router {...props} basename={basename}>
      <QueryParamProvider ReactRouterRoute={Route} {...props} />
    </Router>
  </Root>;

  return (
    <SiteContext.Provider value={siteConfig}>
      <ApiContext.Provider value={client}>
        <GraphQLContextProvider value={{}}>
          <LocaleProvider locale={locale} messages={messages}>
            <ThemeProvider theme={theme}>
              {<RouteContext.Provider value={routeConfig}>
                {root}
              </RouteContext.Provider>}
              <div style={{ zIndex: 10000, position: 'fixed' }}>
                <ToastContainer position="bottom-center" delay={3000} />
              </div>
            </ThemeProvider>
          </LocaleProvider>
        </GraphQLContextProvider>
      </ApiContext.Provider>
    </SiteContext.Provider>
  );
}

export default StandaloneWrapper;
