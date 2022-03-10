import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import DatasetSearch from "./DatasetSearch";

function Standalone(props) {
  // config refactor patch/fallback
  const siteConfig = props?.siteConfig;
  let patch = {};
  if (siteConfig) {
    patch = {...siteConfig, config: siteConfig.dataset, routeContext: siteConfig.routes}
  }

  const path = window.location.pathname;
  return <StandaloneWrapper {...patch} {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <DatasetSearch pageLayout {...patch} {...props} />}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
