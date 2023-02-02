import React, { useContext } from 'react';
import StandaloneWrapper from '../../StandaloneWrapper';
import { Specimen } from './Specimen';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

function Standalone({ siteConfig, ...props }) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.specimenKey.route;
  return (
    <StandaloneWrapper siteConfig={siteConfig} {...props}>
      <Switch>
        <Route
          path={path}
          render={(routeProps) => (
            <Specimen
              id={routeProps.match.params.key}
              config={siteConfig?.specimen}
              {...props}
              {...routeProps}
            />
          )}
        />
      </Switch>
    </StandaloneWrapper>
  );
}

export default Standalone;
