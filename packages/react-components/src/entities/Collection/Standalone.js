import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Collection } from './Collection';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig} {...props}>
    <Standalone {...props} />
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.collectionKey.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <Collection id={routeProps.match.params.key} {...props} {...routeProps} />}
    >
      </Route>
  </Switch>
}

export default Wrap;