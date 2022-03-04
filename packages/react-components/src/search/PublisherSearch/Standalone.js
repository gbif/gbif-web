import React from 'react';
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import PublisherSearch from './PublisherSearch';

function Standalone({siteConfig = {}, ...props}) {
  const path = window.location.pathname;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <PublisherSearch pageLayout config={siteConfig.publisher} {...props} />}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
