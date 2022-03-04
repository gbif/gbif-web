import React from 'react';
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import LiteratureSearch from './LiteratureSearch';

function Standalone({siteConfig = {}, ...props}) {
  const path = window.location.pathname;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <LiteratureSearch pageLayout config={siteConfig.literature} {...props} />}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
