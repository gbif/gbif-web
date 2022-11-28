import React from 'react';
import { defaultContext as defaultRouteConfig } from './RouteContext';

export const defaultContext = {
  routeConfig: defaultRouteConfig,
  occurrence: {},
  dataset: {},
  literature: {},
  institution: {},
  collection: {},
  publisher: {},
  apiKeys: {},
  maps: {
    defaultProjection: 'MERCATOR',
    defaultMapStyle: 'NATURAL',
    mapStyles: {
      ARCTIC: ['NATURAL', 'BRIGHT'],
      PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
      MERCATOR: ['NATURAL', 'BRIGHT', 'DARK'],
      ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK']
    },
    styleLookup: {
      MERCATOR: {
        NATURAL: 'NATURAL_HILLSHADE_MERCATOR'
      }
    }
  }
};

export default React.createContext(defaultContext);
