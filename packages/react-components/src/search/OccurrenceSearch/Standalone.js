import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import OccurrenceSearch from "./OccurrenceSearch";

function Standalone({siteConfig = {}, ...props}) {
  const path = window.location.pathname;
  return <StandaloneWrapper siteConfig={siteConfig} {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <OccurrenceSearch pageLayout config={siteConfig.occurrence} {...props} />}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
