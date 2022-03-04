import React from 'react';
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import CollectionSearch from './CollectionSearch';

function Standalone({siteConfig = {}, ...props}) {
  const path = window.location.pathname;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <CollectionSearch pageLayout config={siteConfig.collection} {...props} />}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
