import React from 'react';
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import InstitutionSearch from './InstitutionSearch';

function Standalone({siteConfig = {}, ...props}) {
  const path = window.location.pathname;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <InstitutionSearch pageLayout config={siteConfig.institution} {...props} />}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
