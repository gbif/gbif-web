import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import DatasetSearch from "./DatasetSearch";

function Standalone({siteConfig = {}, ...props}) {
  const path = window.location.pathname;
  return <StandaloneWrapper siteConfig={siteConfig} {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <DatasetSearch pageLayout config={siteConfig.dataset} {...props} />}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
