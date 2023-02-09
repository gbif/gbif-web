import React, { useContext } from 'react';
import StandaloneWrapper from '../../StandaloneWrapper';
import { Taxon } from './Taxon';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

function Standalone({ siteConfig, ...props }) {
  const routeContext = useContext(RouteContext);
  const path =
    siteConfig?.routes?.taxonKey?.route || routeContext.taxonKey.route;

  return (
    <StandaloneWrapper siteConfig={siteConfig} {...props}>
      <Switch>
        <Route
          path={path}
          render={(routeProps) => (
            <Taxon
              id={routeProps.match.params.key}
              config={siteConfig?.taxon}
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
