import React from 'react';
import { defaultContext as defaultRouteConfig } from './RouteContext';

export const defaultContext = {
  routeConfig: defaultRouteConfig,
  occurrence: {},
  dataset: {},
  literature: {},
  institution: {},
  collection: {},
  publisher: {}
};

export default React.createContext(defaultContext);
