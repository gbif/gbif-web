import React from 'react';

const GeoJsonMap = React.lazy(() =>
  import('./GeoJsonMap').then((module) => ({ default: module.GeoJsonMap }))
);

export { GeoJsonMap };
